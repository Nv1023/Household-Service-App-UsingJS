from collections import Counter
from sqlalchemy import or_,and_
from flask_restful import Api, Resource, fields, marshal_with,marshal
from flask import current_app, jsonify, request,send_file
from flask_security import auth_required,hash_password,roles_accepted,verify_password
from backend.models import *
from flask import current_app as app
from werkzeug.utils import secure_filename
import uuid
import io
import flask_excel as excel
from datetime import datetime  



api = Api(prefix='/api')
cache = app.cache

def get_datastore():
    try:
        return current_app.extensions['security'].datastore
    except (AttributeError, KeyError):
        raise RuntimeError(
            "Security datastore not found. Ensure Flask-Security is properly initialized. "
            "Check that the Security extension is added to the Flask app before accessing the datastore."
        )


Customer_Fields = {
    'email' : fields.String,
    'password' : fields.String,
    'username' : fields.String,
    'fullname' : fields.String,
    'address' : fields.String,
    'pincode' : fields.Integer,
    'phoneno' : fields.Integer,
}

Professional_Fields = {
    'email' : fields.String,
    'password' : fields.String,
    'username' : fields.String,
    'fullname' : fields.String,
    'experience' : fields.Integer,
    'servicename' : fields.Integer,
    'address' : fields.String,
    'pincode' : fields.Integer,
    'phoneno' : fields.Integer,
}

Service_Fields = {
    'id': fields.Integer,
    'service_name': fields.String,
    'service_price': fields.Integer,
    'service_description': fields.String,
    'image_url': fields.String,
}

AdminDashboardProfessional_Fields = {
    'id' : fields.Integer,
    'fullname' : fields.String,
    'experience' : fields.Integer,
    'servicename' : fields.String,
    'address' : fields.String,
    'pincode' : fields.Integer,
    'phoneno' : fields.Integer,
    'approved' : fields.Boolean,
    'is_blocked' : fields.Boolean,
    'average_rating' : fields.Float,
    'service_id' : fields.Integer,
}

AdminDashboardCustomer_Fields = {
    'id' : fields.Integer,
    'fullname' : fields.String,
    'approved' : fields.Boolean,
    'is_blocked' : fields.Boolean,
}

AdminDashboardServiceRemarks_Fields = {
    'id' : fields.Integer,
    'professional_name' : fields.String,
    'professionals' : fields.Nested({
        'fullname' : fields.String,
    }),
    'service_date' : fields.DateTime,
    'rating' : fields.Integer,
    'remarks' : fields.String,
}

ProfessionalDashboardServiceRequest_Fields = {
    'id': fields.Integer,
    'customer': fields.Nested({
        'fullname': fields.String,
        'phoneno': fields.String,
        'address': fields.String,
        'pincode': fields.Integer,
    }),
    'date_of_request': fields.DateTime,
}

CustomerDashboardServiceRequest_Fields = {
    'id': fields.Integer,
    'service' : fields.Nested({
        'id' : fields.Integer,
        'service_name' : fields.String,
    }),
    'professional': fields.Nested({
        'id' : fields.String,
        'fullname': fields.String,
        'phoneno': fields.String,
    }),
    'date_of_request': fields.DateTime,
}

ProfessionalDashboardServiceRemarks_Fields = {
    'id': fields.Integer,
    'service_request': fields.Nested({
        'id': fields.Integer,
        'date_of_completion': fields.DateTime,
        'customer': fields.Nested({
            'fullname': fields.String,
            'phoneno': fields.String,
            'address': fields.String,
            'pincode': fields.Integer,
        })
    }),
    'rating': fields.Integer,
}


ServiceProfessionalListAPI_Fields = {
    'id' : fields.Integer,
    'fullname' : fields.String,
    'phoneno' : fields.Integer,
    'experience' : fields.Integer,
    'average_rating' : fields.Float,
}

ServiceRemarkServiceRequestListAPI_Fields = {
    'id': fields.Integer,
    'service' : fields.Nested({
        'id' : fields.Integer,
        'service_name' : fields.String,
    }),
    'professional': fields.Nested({
        'id' : fields.String,
        'fullname': fields.String,
        'phoneno': fields.String,
    }),
    'date_of_request': fields.DateTime,
}

AddServiceRemark_Fields = {
    'id' : fields.Integer,
    'service_id' : fields.Integer,
    'service_date' : fields.DateTime,
    'professional_id' : fields.Integer,
    'rating' : fields.String,
    'remark' : fields.String,
}


class CustomerRegister(Resource):
    @marshal_with(Customer_Fields)
    def post(self):
        datastore = get_datastore()
        try:
            data = request.get_json()
            email = data.get('email')
            password =data.get('password')
            username = data.get('username')
            fullname = data.get('fullname')
            address = data.get('address')
            pincode = data.get('pincode')
            phoneno = data.get('phoneno')

            if User_Info.query.filter_by(username=username).first():
                return {"message": "Username already exists"}, 400
            
            if User_Info.query.filter_by(email=email).first():
                return {"message": "Email already exists"}, 400
            
            if not all([email, password, username, fullname, address, pincode, phoneno]):
                return {"message": "Missing required fields"}, 400
            
            user = datastore.create_user(
                email=email,
                username=username,
                password=hash_password(password),
                fs_uniquifier=str(uuid.uuid4()),
                active=True
            )
            db.session.commit()

            customer_role = datastore.find_role('Customer')
            datastore.add_role_to_user(user, customer_role)
            db.session.commit()

            customer_info = Customer_Info(
                user_id=user.id,
                fullname=fullname,
                address=address,
                pincode=pincode,
                phoneno=phoneno
            )
            db.session.add(customer_info)
            db.session.commit()

            return jsonify({"message": "Customer registered successfully"}), 201

        except Exception as e:
            db.session.rollback()
            print(f"Error: {str(e)}")
            return jsonify({"message": "An error occurred during registration", "error": str(e)}), 500      

class ProfessionalRegister(Resource):
    @marshal_with(Professional_Fields)
    def post(self):
        datastore = get_datastore()
        try:
            file = request.files.get('file')
            email = request.form.get('email')
            password = request.form.get('password')
            username = request.form.get('username')
            fullname = request.form.get('fullname')
            experience = request.form.get('experience')
            service_id = request.form.get('servicename')
            address = request.form.get('address')
            pincode = request.form.get('pincode')
            phoneno = request.form.get('phoneno')

            file_data = None
            file_mimetype = None
            filename = None
            if file and file.filename:
                filename = secure_filename(file.filename)         
                file_data = file.read()
                file_mimetype = file.mimetype
                filename = filename

            if User_Info.query.filter_by(username=username).first():
                return {"message": "Username already exists"}, 400
            
            if User_Info.query.filter_by(email=email).first():
                return {"message": "Email already exists"}, 400
            
            if not all([email, password, username, fullname, experience, service_id, address, pincode, phoneno]):
                return {"message": "Missing required fields"}, 400
            
            user = datastore.create_user(
                email=email,
                username=username,
                password=hash_password(password),
                fs_uniquifier=str(uuid.uuid4()),
                active=True
            )
            db.session.commit()

            professional_role = datastore.find_role('Professional')
            datastore.add_role_to_user(user, professional_role)
            db.session.commit()

            selected_service = Service_Info.query.filter_by(id=service_id).first()

            professional_info = Professional_Info(
                user_id=user.id,
                fullname=fullname,
                experience=int(experience),
                servicename=selected_service.service_name,
                address=address,
                pincode=int(pincode),
                phoneno=int(phoneno),
                file_data=file_data,
                file_mimetype=file_mimetype,
                filename = filename
            )
            db.session.add(professional_info)
            db.session.commit()

            return jsonify({
                "message": "Professional registered successfully",
                "file_uploaded": bool(file_data)
            }), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({
                "message": "An error occurred during registration", 
                "error": str(e)
            }), 500  

class UserLogin(Resource):
    def post(self):
        datastore = get_datastore()
        data = request.get_json()

        if not data:
            return {"success": False, "message": "Invalid JSON data"}, 400

        email = data.get('email')
        password = data.get('password', "").strip()

        if not email or not password:
            return {"success": False, "message": "Invalid inputs"}, 400

        user = datastore.find_user(email=email)
        if not user:
            return {"success": False, "message": "Invalid email"}, 400

        if not verify_password(password, user.password):
            return {"success": False, "message": "Incorrect password"}, 400

        if not user.roles:
            return {"success": False, "message": "User has no assigned roles"}, 400


        customer = Customer_Info.query.filter_by(user_id=user.id).first()
        professional = Professional_Info.query.filter_by(user_id=user.id).first()

        if (customer and customer.is_blocked) or (professional and (professional.is_blocked or not professional.approved)):
            return {"success": False, "message": "Your account has been blocked or is not approved. Please contact support."}, 403


        auth_token = user.get_auth_token()

        return {
            "success": True,
            "token": auth_token,
            "email": user.email,
            "role": user.roles[0].name,
            "id": user.id,
            "username" : user.username
        }, 200

class ServiceAPI(Resource):
    @marshal_with(Service_Fields)
    @cache.cached(timeout = 5)
    def get(self, id):
        service = Service_Info.query.get(id)
        if not service:
            return {"message": "Service not found"}, 404
        return service

    @auth_required('token')
    @roles_accepted('Admin')
    def delete(self, id):
        service = Service_Info.query.get(id)
        if not service:
            return {"message": "Service not found"}, 404
        try:
            db.session.delete(service)
            db.session.commit()
            return {"message": "Service deleted", "id": id}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error deleting service: {str(e)}"}, 500
        
    @auth_required('token')
    @roles_accepted('Admin')
    def put(self, id):
        service = Service_Info.query.get(id)
        if not service:
            return {"message": "Service not found"}, 404
        
        data = request.get_json()
        service_name = data.get('service_name')
        service_price = data.get('service_price')
        service_description = data.get('service_description')

        if not all([service_name, service_price, service_description]):
            return {"message": "All fields (service_name, service_price, service_description) are required"}, 400

        service.service_name = service_name
        service.service_price = service_price
        service.service_description = service_description
        try:
            db.session.commit()
            return {"message": "Service updated", "id": service.id}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error updating service: {str(e)}"}, 500


class ServiceListAPI(Resource):
    @marshal_with(Service_Fields)
    @cache.cached(timeout = 5)
    def get(self):
        service_list = Service_Info.query.all()
        if not service_list:
            return {"message": "No services found"}, 404
        
        services = []
        for service in service_list:
            image_url = f"http://localhost:5000/api/services/{service.id}/image" if service.file_data else None
            if image_url:
                image_url = image_url.strip() 
            service_data = {
                "id": service.id,
                "service_name": service.service_name,
                "service_description": service.service_description,
                "service_price": service.service_price,
                "image_url": image_url
            }
            services.append(service_data)

        return services, 200

    @auth_required('token')
    @roles_accepted('Admin')
    def post(self):
        service_name = request.form.get('service_name')
        service_price = request.form.get('service_price')
        service_description = request.form.get('service_description')

        file = request.files.get('file')

        if not all([service_name, service_price, service_description]):
            return {"message": "All fields (service_name, service_price, service_description) are required"}, 400

        service = Service_Info(
            service_name=service_name, 
            service_price=service_price, 
            service_description=service_description
        )

        if file:
            service.filename = secure_filename(file.filename)
            service.file_data = file.read() 
            service.file_mimetype = file.mimetype  

        try:
            db.session.add(service)
            db.session.commit()
            return {"message": "Service created successfully", "id": service.id}, 201
        except Exception as e:
            db.session.rollback()
            return {"message": f"Error creating service: {str(e)}"}, 500
        



class ServiceImageAPI(Resource):
    @cache.memoize(timeout = 5)
    def get(self, service_id):
        service = Service_Info.query.get(service_id)
        if not service or not service.file_data:
            return {"message": "Image not found"}, 404
        
        mimetype = service.file_mimetype if service.file_mimetype else "image/jpeg"

        response = send_file(io.BytesIO(service.file_data), mimetype=mimetype, as_attachment=False)
        response.headers.set('Content-Type', mimetype)
        
        return response

class ServiceProfessionalListAPI(Resource):
    @auth_required('token')
    @marshal_with(ServiceProfessionalListAPI_Fields)
    @cache.memoize(timeout = 5)
    def get(self,id):
        service = Service_Info.query.get(id)
        if not service:
            return {"message": "No service found"}, 404
        professionals = Professional_Info.query.filter_by(servicename=service.service_name, is_blocked=False).all()
        if not professionals:
            return {"message": "No professionals found"}, 404
        return professionals

class ProfessionalListAPI(Resource):
    @auth_required('token')
    @marshal_with(AdminDashboardProfessional_Fields)
    @cache.cached(timeout = 5)
    def get(self):
        professionals = Professional_Info.query.all()
        if not professionals:
            return {"message": "No professionals found"}, 404
        return professionals
    
class CustomerAPI(Resource):
    @auth_required('token')
    @cache.memoize(timeout = 5)
    def get(self, id):
        customer = (db.session.query(Customer_Info, User_Info).join(User_Info, Customer_Info.user_id == User_Info.id)
            .filter(Customer_Info.user_id == id).first())

        if not customer:
            return {"message": "No customer found"}, 404

        customer_info, user_info = customer 

        response = {
            "email": user_info.email, 
            "username": user_info.username,
            "fullname": customer_info.fullname,
            "address": customer_info.address,
            "pincode": customer_info.pincode,
            "phoneno": customer_info.phoneno,
        }

        return response
    
class ProfessionalAPI(Resource):
    @auth_required('token')
    @cache.memoize(timeout = 5)
    def get(self, id):
        professional = (db.session.query(Professional_Info, User_Info).join(User_Info, Professional_Info.user_id == User_Info.id)
            .filter(Professional_Info.user_id == id).first())

        if not professional:
            return {"message": "No professional found"}, 404

        professional_info, user_info = professional 

        response = {
            "email": user_info.email, 
            "username": user_info.username,
            "fullname": professional_info.fullname,
            "address": professional_info.address,
            "pincode": professional_info.pincode,
            "phoneno": professional_info.phoneno,
            "experience" : professional_info.experience,
        }

        return response

    
class CustomerListAPI(Resource):
    @auth_required('token')
    @cache.cached(timeout = 5)
    @marshal_with(AdminDashboardCustomer_Fields)
    def get(self):
        customers = Customer_Info.query.all()
        if not customers:
            return {"message": "No customers found"}, 404
        return customers
    
class ServiceRemarksListAPI(Resource):
    @auth_required('token')
    @cache.memoize(timeout = 5)
    def get(self, id):
        role = request.headers.get('Role')
        if role == "Admin":
            serviceremarks = Service_Remarks.query.all()
            return marshal(serviceremarks, AdminDashboardServiceRemarks_Fields)
        elif role == "Professional":
            serviceremarks = (
                Service_Remarks.query
                .join(Professional_Info, Service_Remarks.professional_id == Professional_Info.id)
                .filter(Professional_Info.user_id == id).all()) 
            return marshal(serviceremarks, ProfessionalDashboardServiceRemarks_Fields)

    
class ServiceRequestListAPI(Resource):
    @auth_required('token')
    @cache.memoize(timeout = 5)
    def get(self,id):
        role = request.headers.get('Role')
        if role == "Professional":
            servicerequest = (
                Service_Request.query
                .join(Professional_Info, Service_Request.professional_id == Professional_Info.id)
                .filter(and_(Professional_Info.user_id == id , Service_Request.service_status == "requested")).all())        
            return marshal(servicerequest,ProfessionalDashboardServiceRequest_Fields)
        elif role == "Customer":
            servicerequest = (Service_Request.query.join(Customer_Info, Service_Request.customer_id == Customer_Info.id)
                .filter(and_(Customer_Info.user_id == id, Service_Request.service_status == "Accepted")).all())  
            return marshal(servicerequest, CustomerDashboardServiceRequest_Fields)

class ServiceRemarkServiceRequestListAPI(Resource):
    @auth_required('token')
    @roles_accepted('Customer')
    @marshal_with(ServiceRemarkServiceRequestListAPI_Fields)
    @cache.memoize(timeout = 5)
    def get(self,id):
        servicerequest = Service_Request.query.filter_by(id=id).first()

        if not servicerequest:
            return {"message": "ServiceRequest not found"}, 404
        
        return servicerequest

class ProfessionalResource(Resource):
    @auth_required('token')
    @roles_accepted('Admin')
    def patch(self, id):
        action = request.json.get('action')
        professional = Professional_Info.query.get(id)

        if not professional:
            return {"message": "Professional not found"}, 404

        if action == "approve":
            professional.approved = True
        elif action == "reject":
            professional.approved = False
        elif action == "block":
            professional.is_blocked = True
        elif action == "unblock":
            professional.is_blocked = False
        else:
            return {"message": "Invalid action"}, 400

        db.session.commit()
        return {"message": f"Professional {action}d successfully"}, 200
    
class ServiceRequestResource(Resource):
    @auth_required('token')
    @roles_accepted('Professional')
    def patch(self, id):
        action = request.json.get('action')
        servicerequest = Service_Request.query.get(id)

        if not servicerequest:
            return {"message": "Service Request not found"}, 404

        if action == "accept":
            servicerequest.service_status = 'Accepted'
        elif action == "reject":
            servicerequest.service_status = 'Rejected'
        else:
            return {"message": "Invalid action"}, 400

        db.session.commit()
        return {"message": f"Professional {action}d successfully"}, 200
    
class BulkApproveResource(Resource):
    @auth_required('token')
    @roles_accepted('Admin')
    def post(self):
        professionals = Professional_Info.query.filter_by(approved=False).all()
        for professional in professionals:
            professional.approved = True
        db.session.commit()
        return {"message": f"{len(professionals)} professionals approved successfully"}, 200
    
class ProfessionalDocumentDownload(Resource):
    @roles_accepted('Admin')
    @auth_required('token')
    def get(self,id):
        professional = Professional_Info.query.get(id)
        if not professional:
            return {"message": "Professional not found"}, 404
        blob_data = professional.file_data
        mime_type = professional.file_mimetype
        filename = professional.filename

        if blob_data and mime_type:
            file_data = io.BytesIO(blob_data)
            return send_file(file_data, mimetype=mime_type, as_attachment=True,download_name=filename) 
        return {"message": "File not available"}, 404


class ServiceRequestCSVDownload(Resource):
    @auth_required('token')
    @roles_accepted('Admin')
    def get(self):
        from backend.celery.tasks import export_service_requests
        service_requests = Service_Request.query.filter_by(service_status="Closed").all()

        if not service_requests:
            return {"message": "No closed service requests found"}, 404

        data = [
            ['Service ID', 'Customer ID', 'Professional ID', 'Date of Request', 'Remarks']
        ] + [
            [req.id, req.customer_id, req.professional_id, str(req.date_of_request), req.remarks or 'N/A']
            for req in service_requests
        ]

        csv_data = excel.make_response_from_array(data, "csv", file_name="ServiceRequests")

        export_service_requests.delay("pacwynjaswanth@gmail.com")

        return csv_data
    

class CustomerResource(Resource):
    @auth_required('token')
    @roles_accepted('Admin')
    def patch(self, id):
        action = request.json.get('action')
        customer = Customer_Info.query.get(id)

        if not customer:
            return {"message": "Professional not found"}, 404
        if action == "block":
            customer.is_blocked = True
        elif action == "unblock":
            customer.is_blocked = False
        else:
            return {"message": "Invalid action"}, 400

        db.session.commit()
        return {"message": f"Customer {action} successfully"}, 200
    
class BookAppointment(Resource):
    @auth_required('token')
    @roles_accepted("Customer")
    def post(self, id, customerid):
        data = request.get_json()
        if not data:
            return {"success": False, "message": "Invalid JSON data"}, 400

        try:
            customer = Customer_Info.query.filter_by(user_id=customerid).first()
            if customer:
                customer_id = customer.id
            service_id = id
            professional_id = data.get('professional_id')
            date_of_request_str = data.get('date_of_request')
            service_problem = data.get('service_problem')

            if not all([service_id, customer_id, professional_id, date_of_request_str, service_problem]):
                return {"success": False, "message": "Missing required fields"}, 400
            
            date_of_request = datetime.strptime(date_of_request_str, "%Y-%m-%dT%H:%M")

            booking = Service_Request(
                service_id = service_id,
                customer_id = customer_id,
                professional_id = professional_id,
                date_of_request = date_of_request,
                service_problem = service_problem,
            )

            db.session.add(booking)
            db.session.commit()

            return {
                "success": True,
                "message": "Appointment booked successfully",
            }, 201

        except Exception as e:
            return {"success": False, "message": f"An error occurred: {str(e)}"}, 500
        

class AddServiceRemarks(Resource):
    @auth_required('token')
    @roles_accepted("Customer")
    def post(self):
        data = request.get_json()
        if not data:
            return {"success": False, "message": "Invalid JSON data"}, 400

        try:
            service_id = data.get('servicerequest_id')
            professional_id = data.get('professional_id')
            remarks = data.get('remarks')
            rating = int(data.get('rating'))

            if not all([service_id, professional_id, remarks, rating]):
                return {"success": False, "message": "Missing required fields"}, 400

            serviceremarks = Service_Remarks(
                service_id=service_id,
                professional_id=professional_id,
                service_date=datetime.now(),  
                remarks=remarks,
                rating=rating,
            )

            servicerequest = Service_Request.query.filter_by(id=service_id).first()
            if servicerequest:
                servicerequest.date_of_completion = datetime.now()  
                servicerequest.service_status = 'Closed'

            professional = Professional_Info.query.get(professional_id)
            if professional:
                all_ratings = [remark.rating for remark in professional.service_remarks]
                all_ratings.append(rating)

                if all_ratings:
                    avg_rating = sum(all_ratings) / len(all_ratings)
                    professional.average_rating = round(avg_rating, 2)
                else:
                    professional.average_rating = 0

            db.session.add(serviceremarks)
            db.session.commit()

            return {
                "success": True,
                "message": "Service Remark Added successfully",
            }, 201

        except Exception as e:
            db.session.rollback()
            return {"success": False, "message": f"An error occurred: {str(e)}"}, 500
        
class AdminSummary(Resource):
    @auth_required('token')
    @roles_accepted("Admin")
    @cache.memoize(timeout = 5)
    def get(self):
        service_remarks = Service_Remarks.query.all()
        ratings = [service.rating for service in service_remarks]

        rating_counts = Counter(ratings)
        labels = list(rating_counts.keys())  
        data = list(rating_counts.values())  

        service_request = Service_Request.query.all()
        statuses = [service.service_status for service in service_request]

        status_counts = Counter(statuses)
        labels1 = list(status_counts.keys())  
        data1 = list(status_counts.values()) 

        return {
            "labels": labels,
            "data": data,
            "labels1": labels1,
            "data1": data1
        }
    
class CustomerSummary(Resource):
    @auth_required('token')
    @roles_accepted("Customer")
    @cache.memoize(timeout = 5)
    def get(self,id):
        
        customer = Customer_Info.query.filter_by(user_id=id).first()

        if not customer:
            return {"error": "Customer not found"}, 404  

        service_request = Service_Request.query.filter_by(customer_id=customer.id).all()

        statuses = [service.service_status for service in service_request]
        status_counts = Counter(statuses)
        labels = list(status_counts.keys())
        data = list(status_counts.values())

        return {
            'labels' : labels,  
            'data' : data,
        }

class ProfessionalSummary(Resource):
    @auth_required('token')
    @roles_accepted("Professional")
    @cache.memoize(timeout = 5)
    def get(self,id):
        print(f"📥 Data fetched from the database for ID: {id}") 
        professional = Professional_Info.query.filter_by(user_id = id).first()

        if not professional:
            return{"error" : "Professional not found"},404
        
        service_remarks = Service_Remarks.query.filter_by(professional_id=professional.id).all()
        ratings = [service.rating for service in service_remarks]
    

        rating_counts = Counter(ratings)
        labels = list(rating_counts.keys())  
        data = list(rating_counts.values()) 

        service_request = Service_Request.query.filter_by(professional_id=professional.id).all()
        statuses = [service.service_status for service in service_request]
    

        status_counts = Counter(statuses)
        labels1 = list(status_counts.keys())
        data1 = list(status_counts.values())
    

        return {
        'labels' : labels,  
        'data' : data,
        'labels1' : labels1,
        'data1' : data1
        }

class CustomerProfile(Resource):
    @auth_required('token')
    @roles_accepted("Customer")
    @marshal_with(Customer_Fields)
    def post(self, id):
        customer = (db.session.query(Customer_Info, User_Info).join(User_Info, Customer_Info.user_id == User_Info.id)
            .filter(Customer_Info.user_id == id).first())

        if not customer:
            return {"message": "No customer found"}, 404

        customer_info, user_info = customer

        try:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            username = data.get('username')
            fullname = data.get('fullname')
            address = data.get('address')
            pincode = data.get('pincode')
            phoneno = data.get('phoneno')

            if not all([email, password, username, fullname, address, pincode, phoneno]):
                return {"message": "Missing required fields"}, 400

            if User_Info.query.filter(User_Info.username == username, User_Info.id != id).first():
                return {"message": "Username already exists"}, 400

            if User_Info.query.filter(User_Info.email == email, User_Info.id != id).first():
                return {"message": "Email already exists"}, 400

            user_info.email = email
            user_info.username = username
            if password:  
                user_info.password = hash_password(password)

            customer_info.fullname = fullname
            customer_info.address = address
            customer_info.pincode = pincode
            customer_info.phoneno = phoneno

            db.session.commit()

            return {"message": "Customer profile updated successfully"}, 200

        except Exception as e:
            db.session.rollback()
            print(f"Error: {str(e)}")
            return {"message": "An error occurred during profile updation", "error": str(e)}, 500
        
class ProfessionalProfile(Resource):
    @auth_required('token')
    @roles_accepted("Professional")
    @marshal_with(Professional_Fields)
    def post(self, id):
        professional = (db.session.query(Professional_Info, User_Info).join(User_Info, Professional_Info.user_id == User_Info.id)
            .filter(Professional_Info.user_id == id).first())

        if not professional:
            return {"message": "No professional found"}, 404

        professional_info, user_info = professional

        try:
            file = request.files.get('file')
            email = request.form.get('email')
            password = request.form.get('password')
            username = request.form.get('username')
            fullname = request.form.get('fullname')
            experience = request.form.get('experience')
            service_id = request.form.get('servicename')
            address = request.form.get('address')
            pincode = request.form.get('pincode')
            phoneno = request.form.get('phoneno')

            file_data = None
            file_mimetype = None
            filename = None
            if file and file.filename:
                filename = secure_filename(file.filename)         
                file_data = file.read()
                file_mimetype = file.mimetype
                filename = filename

            if not all([email, password, username, fullname, address, pincode, phoneno,experience]):
                return {"message": "Missing required fields"}, 400

            if User_Info.query.filter(User_Info.username == username, User_Info.id != id).first():
                return {"message": "Username already exists"}, 400

            if User_Info.query.filter(User_Info.email == email, User_Info.id != id).first():
                return {"message": "Email already exists"}, 400
            
            selected_service = Service_Info.query.filter_by(id=service_id).first()

            user_info.email = email
            user_info.username = username
            if password:  
                user_info.password = hash_password(password)

            professional_info.fullname = fullname
            professional_info.address = address
            professional_info.pincode = int(pincode)
            professional_info.phoneno = int(phoneno)
            professional_info.experience = experience
            professional_info.servicename = selected_service.service_name
            professional_info.file_data = file_data
            professional_info.file_mimetype = file_mimetype
            professional_info.filename = filename

            db.session.commit()

            return {"message": "Customer profile updated successfully"}, 200

        except Exception as e:
            db.session.rollback()
            print(f"Error: {str(e)}")
            return {"message": "An error occurred during profile updation", "error": str(e)}, 500
        


class AdminSearch(Resource):
    @auth_required('token')
    @roles_accepted("Admin")
    def get(self):
        parameter = request.args.get('parameter')
        query = request.args.get('query')

        if not parameter or not query:
            return {"message": "Both 'parameter' and 'query' are required"}, 400

        if parameter == 'Services':
            services = Service_Info.query.filter(
                or_(
                    Service_Info.service_name.ilike(f'%{query}%'),
                    Service_Info.service_price.ilike(f'%{query}%')
                )
            ).all()
            return marshal(services, Service_Fields), 200

        elif parameter == 'Professionals':
            professionals = Professional_Info.query.filter(
                or_(
                    Professional_Info.fullname.ilike(f'%{query}%'),
                    Professional_Info.servicename.ilike(f'%{query}%'),
                    Professional_Info.experience.ilike(f'%{query}%'),
                    Professional_Info.approved.ilike(f'%{query}%'),
                    Professional_Info.is_blocked.ilike(f'%{query}%')
                )
            ).all()
            return marshal(professionals, AdminDashboardProfessional_Fields), 200

        elif parameter == 'ServiceHistory':
            service_details = (
                db.session.query(Service_Remarks, Professional_Info)
                .join(Professional_Info, Service_Remarks.professional_id == Professional_Info.id)
                .filter(
                or_(
                    Service_Remarks.service_date.ilike(f'%{query}%'),
                    Professional_Info.fullname.ilike(f'%{query}%'),
                    Service_Remarks.rating.ilike(f'%{query}%')
                )
            ).all())
            results = []
            for service_remark, professional_info in service_details:
                results.append({
                    "id": service_remark.id,
                    "professional_name": professional_info.fullname,
                    "service_date": service_remark.service_date,
                    "rating": service_remark.rating,
                    "remarks": service_remark.remarks,
                })
            return marshal(results, AdminDashboardServiceRemarks_Fields), 200

        elif parameter == 'Customers':
            customers = Customer_Info.query.filter(
                or_(
                    Customer_Info.fullname.ilike(f'%{query}%'),
                    Customer_Info.phoneno.ilike(f'%{query}%')
                )
            ).all()
            return marshal(customers, AdminDashboardCustomer_Fields), 200

        else:
            return {"message": "Invalid parameter"}, 400


class ProfessionalSearch(Resource):
    @auth_required('token')
    @roles_accepted("Professional")
    def get(self, id):
        parameter = request.args.get('parameter')
        query = request.args.get('query')

        if not parameter or not query:
            return {"message": "Both 'parameter' and 'query' are required"}, 400

        professional = Professional_Info.query.filter_by(user_id=id).first()
        if not professional:
            return {"message": "Professional not found"}, 404

        professional_id = professional.id

        if parameter == 'AvailableServices':
            service_requests = (
                db.session.query(Service_Request, Customer_Info)
                .join(Customer_Info, Service_Request.customer_id == Customer_Info.id)
                .filter(
                    Service_Request.professional_id == professional_id,  
                    Service_Request.service_status == 'requested',  
                    or_(
                        Customer_Info.fullname.ilike(f'%{query}%'),
                        Customer_Info.phoneno.ilike(f'%{query}%'),
                        Customer_Info.address.ilike(f'%{query}%'),
                        Customer_Info.pincode.ilike(f'%{query}%'),
                        Service_Request.date_of_request.ilike(f'%{query}%')
                    )
                )
                .all()
            )
            results = []
            for service_request, customer_info in service_requests:
                results.append({
                    "id": service_request.id,
                    "customer": {
                        "fullname": customer_info.fullname,
                        "phoneno": customer_info.phoneno,
                        "address": customer_info.address,
                        "pincode": customer_info.pincode,
                    },
                    "date_of_request": service_request.date_of_request,
                })
            return marshal(results, ProfessionalDashboardServiceRequest_Fields), 200

        elif parameter == 'ServiceHistory':
            service_remarks = (
                db.session.query(Service_Remarks, Service_Request, Customer_Info)
                .join(Service_Request, Service_Remarks.service_id == Service_Request.id)
                .join(Customer_Info, Service_Request.customer_id == Customer_Info.id)
                .filter(
                    Service_Request.professional_id == professional_id,  
                    or_(
                        Customer_Info.fullname.ilike(f'%{query}%'),
                        Customer_Info.phoneno.ilike(f'%{query}%'),
                        Customer_Info.address.ilike(f'%{query}%'),
                        Customer_Info.pincode.ilike(f'%{query}%'),
                        Service_Request.date_of_completion.ilike(f'%{query}%'),
                        Service_Remarks.rating.ilike(f'%{query}%')
                    )
                )
                .all()
            )
            results = []
            for service_remark, service_request, customer_info in service_remarks:
                results.append({
                    "id": service_remark.id,
                    "service_request": {
                        "id": service_request.id,
                        "date_of_completion": service_request.date_of_completion,
                        "customer": {
                            "fullname": customer_info.fullname,
                            "phoneno": customer_info.phoneno,
                            "address": customer_info.address,
                            "pincode": customer_info.pincode,
                        }
                    },
                    "rating": service_remark.rating,
                })
            return marshal(results, ProfessionalDashboardServiceRemarks_Fields), 200

        else:
            return {"message": "Invalid parameter"}, 400
        
class CustomerSearch(Resource):
    @auth_required('token')
    @roles_accepted("Customer")
    def get(self, id):
        parameter = request.args.get('parameter')
        query = request.args.get('query')

        if not parameter or not query:
            return {"message": "Both 'parameter' and 'query' are required"}, 400
        
        if parameter == 'Services':
            services = Service_Info.query.filter(
                Service_Info.service_name.ilike(f'%{query}%')
            ).all()

            service_data_list = []
            for service in services:
                image_url = f"http://localhost:5000/api/services/{service.id}/image" if service.file_data else None
                if image_url:
                    image_url = image_url.strip()
                
                service_data = {
                    "id": service.id,
                    "service_name": service.service_name,
                    "service_description": service.service_description,
                    "service_price": service.service_price,
                    "image_url": image_url,
                }
                service_data_list.append(service_data)
            
            return marshal(service_data_list, Service_Fields), 200

        if parameter == 'Professionals':
            professionals = db.session.query(
                Professional_Info.id,
                Professional_Info.fullname,
                Professional_Info.experience,
                Professional_Info.phoneno,
                Professional_Info.average_rating,
                Service_Info.id.label('service_id'), 
            ).join(Service_Info, Professional_Info.servicename == Service_Info.service_name) \
             .filter(
                or_(
                    Professional_Info.fullname.ilike(f'%{query}%'),
                    Professional_Info.servicename.ilike(f'%{query}%'),
                    Professional_Info.experience.ilike(f'%{query}%'),
                    Professional_Info.average_rating.ilike(f'%{query}%'),
                    Professional_Info.pincode.ilike(f'%{query}%')
                )
            ).all()

            professional_data = [
                {
                    "id": prof.id,
                    "fullname": prof.fullname,
                    "experience": prof.experience,
                    "phoneno": prof.phoneno,
                    "average_rating": prof.average_rating,
                    "service_id": prof.service_id  
                }
                for prof in professionals
            ]

            return marshal(professional_data, AdminDashboardProfessional_Fields), 200

        else:
            return {"message": "Invalid parameter"}, 400


api.add_resource(ProfessionalResource, '/professional/action/<int:id>')
api.add_resource(ServiceRequestResource, '/servicerequest/<int:id>')
api.add_resource(CustomerResource, '/customer/action/<int:id>')
api.add_resource(BulkApproveResource, '/professional/approve-all')
api.add_resource(ServiceAPI, '/service/<int:id>')
api.add_resource(ServiceListAPI, '/services')
api.add_resource(CustomerRegister,'/customerregister')
api.add_resource(ProfessionalRegister,'/professionalregister')
api.add_resource(UserLogin,'/login')
api.add_resource(ProfessionalDocumentDownload,'/professionaldocument/<int:id>')
api.add_resource(CustomerListAPI, '/customers')
api.add_resource(ProfessionalListAPI, '/professionals')
api.add_resource(ServiceRemarksListAPI, '/serviceremarks/<int:id>')
api.add_resource(ServiceRequestListAPI, '/servicerequest/<int:id>')
api.add_resource(ServiceImageAPI, '/services/<int:service_id>/image')
api.add_resource(ServiceProfessionalListAPI,'/service/professional/<int:id>')
api.add_resource(BookAppointment, '/service-request/<int:id>/<int:customerid>')
api.add_resource(AddServiceRemarks, '/service-remark')
api.add_resource(ServiceRemarkServiceRequestListAPI, '/serviceremark/servicerequest/<int:id>')
api.add_resource(AdminSummary,'/admin/summary')
api.add_resource(CustomerSummary,'/customer/summary/<int:id>')
api.add_resource(ProfessionalSummary,'/professional/summary/<int:id>')
api.add_resource(CustomerAPI, '/customer/<int:id>')
api.add_resource(CustomerProfile, '/customer/profile/<int:id>')
api.add_resource(ProfessionalProfile, '/professional/profile/<int:id>')
api.add_resource(ProfessionalAPI, '/professional/<int:id>')
api.add_resource(AdminSearch, '/admin/search')
api.add_resource(ProfessionalSearch, '/professional/search/<int:id>')
api.add_resource(CustomerSearch, '/customer/search/<int:id>')
api.add_resource(ServiceRequestCSVDownload, '/service_requests/export')









