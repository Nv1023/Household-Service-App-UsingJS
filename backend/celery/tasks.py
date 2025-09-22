from datetime import datetime, timedelta, timezone
import os
from flask_mail import Message
from app import app
from backend.models import *
from celery import shared_task
from jinja2 import Template
import flask_excel as excel

mail = app.mail

def send_email(recipient_email, subject, body, html=None):
    """ Helper function to send emails with improved error handling """
    msg = Message(
        subject,
        recipients=[recipient_email]
    )
    msg.body = body
    if html:
        msg.html = html

    try:
        with app.app_context():
            mail.send(msg)
        print(f"✅ Email sent successfully to {recipient_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {recipient_email}: {str(e)}")

@shared_task(ignore_result=True)
def check_and_send_reminders():
    """Send daily reminders to professionals with pending service requests."""
    with app.app_context():
        one_day_ago = datetime.now(timezone.utc) - timedelta(days=1)

        pending_requests = Service_Request.query.filter(
            Service_Request.service_status == "requested",
            Service_Request.date_of_request <= one_day_ago
        ).all()

        for request in pending_requests:
            professional = request.professional
            user_info = User_Info.query.get(professional.user_id)
            if not user_info:
                print(f"❌ No associated user found for Professional ID: {professional.id}")
                continue

            email_body = f"""
            Dear {professional.fullname},

            You have a pending service request that requires your attention.

            🏠 **Service Details:**
            - **Service ID:** {request.id}
            - **Customer Name:** {request.customer.fullname}
            - **Service Date:** {request.date_of_request}

            Please visit your dashboard on **SwiftFix** to accept or reject the request.

            Regards,  
            **SwiftFix Team**  
            Your Trusted Home Service Partner
            """
            send_email(user_info.email, "SwiftFix Reminder: Pending Service Request", email_body)

        accepted_requests = Service_Request.query.filter(
            Service_Request.service_status == "Accepted",
            Service_Request.date_of_completion == None,
            Service_Request.date_of_request <= one_day_ago
        ).all()

        for request in accepted_requests:
            professional = request.professional
            user_info = User_Info.query.get(professional.user_id)
            if not user_info:
                print(f"❌ No associated user found for Professional ID: {professional.id}")
                continue

            email_body = f"""
            Dear {professional.fullname},

            You have accepted a service request but have not yet marked it as completed.

            🏠 Service Details:
            - Service ID: {request.id}
            - Customer Name: {request.customer.fullname}
            - Service Date: {request.date_of_request}

            Kindly visit the customer or update the status on your SwiftFix dashboard.

            Regards,  
            SwiftFix Team
            Your Trusted Home Service Partner
            """
            send_email(user_info.email, "SwiftFix Reminder: Follow-Up on Accepted Service Request", email_body)

@shared_task(ignore_result=True)
def send_monthly_activity_report():
    """Generate and send monthly activity reports to customers."""
    with app.app_context():
        customers = Customer_Info.query.all()

        for customer in customers:
            first_day_of_month = datetime.now(timezone.utc).replace(day=1)
            services = Service_Request.query.filter(Service_Request.customer_id == customer.id,
                Service_Request.date_of_request >= first_day_of_month).all()

            if services:
                user = User_Info.query.get(customer.user_id)
                if not user:
                    print(f"User not found for customer ID {customer.id}")
                    continue

                html_report = generate_html_report(customer, services)
                send_email(user.email, "SwiftFix Monthly Activity Report", None, html_report)

def generate_html_report(customer, services):
    """Generates a monthly report in HTML format."""
    template = Template("""
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            h1 { background-color: #4CAF50; color: white; padding: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
        </style>
    </head>
    <body>
        <h1>SwiftFix - Monthly Activity Report</h1>
        <p>Dear {{ customer.fullname }},</p>
        <p>Here's your monthly activity summary for {{ month }}:</p>

        <table>
            <thead>
                <tr>
                    <th>Service ID</th>
                    <th>Service Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {% for service in services %}
                <tr>
                    <td>{{ service.id }}</td>
                    <td>{{ service.date_of_request }}</td>
                    <td>{{ service.service_status }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>

        <p>Thank you for choosing SwiftFix!</p>
        <p>Best Regards,<br>SwiftFix Team</p>
    </body>
    </html>
    """)
    return template.render(customer=customer, services=services, month=datetime.now().strftime("%B"))

@shared_task(ignore_result=True)
def export_service_requests(admin_email):
    """Export closed service requests as a CSV file and send it to the admin."""
    with app.app_context():
        services = Service_Request.query.filter_by(service_status="Closed").all()

        if not services:
            print("No closed service requests found.")
            return

        data = [["Service ID", "Customer ID", "Professional ID", "Date of Request", "Remarks"]]
        for service in services:
            data.append([
                service.id,
                service.customer_id,
                service.professional_id,
                str(service.date_of_request),
                service.remarks or 'N/A'
            ])

        response = excel.make_response_from_array(data, "csv")
        csv_bytes = response.data

        file_name = f"service_requests_{datetime.now().strftime('%Y_%m_%d')}.csv"
        file_path = os.path.join("backend/celery/csv", file_name)

        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, 'wb') as f:
            f.write(csv_bytes)

        msg = Message(
            "SwiftFix Report: Service Requests Exported",
            recipients=[admin_email]
        )
        msg.body = f"""
        Dear Admin,

        The export of closed service requests has been successfully generated.
        You can download the file from the following path:

        {file_path}

        Regards,
        SwiftFix Team
        """

        with open(file_path, 'rb') as f:
            msg.attach(file_name, "text/csv", f.read())

        try:
            mail.send(msg)
            print(f"CSV export alert sent to {admin_email}")
        except Exception as e:
            print(f"Failed to send CSV alert to {admin_email}: {str(e)}")
