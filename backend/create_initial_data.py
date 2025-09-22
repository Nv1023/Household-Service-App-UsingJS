from flask import current_app as app
from backend.models import db
from flask_security import hash_password
import uuid

def create_initial_data(security, datastore):
    from backend.models import db
    db.create_all()

    admin_role = datastore.find_role('Admin')
    if not admin_role:
        admin_role = datastore.create_role(name='Admin', description='Admin of the app')

    professional_role = datastore.find_role('Professional')
    if not professional_role:
        professional_role = datastore.create_role(name='Professional', description='Professional of the app')

    customer_role = datastore.find_role('Customer')
    if not customer_role:
        customer_role = datastore.create_role(name='Customer', description='Customer of the app')

    admin_user = datastore.find_user(email='pacwynjaswanth@gmail.com')
    if not admin_user:
        admin_user = datastore.create_user(
            email='pacwynjaswanth@gmail.com',
            password=hash_password('1234'),
            username='admin',
            fs_uniquifier=str(uuid.uuid4())  
        )

    if admin_role not in admin_user.roles:
        datastore.add_role_to_user(admin_user, admin_role)

    db.session.commit()