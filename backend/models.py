from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_security import RoleMixin, UserMixin

db = SQLAlchemy()

class Role_Info(db.Model, RoleMixin):
    __tablename__ = 'role_info'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String(300), nullable=True)

class User_Info(db.Model, UserMixin):
    __tablename__ = 'user_info'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True)

    roles = db.relationship(
        'Role_Info',
        secondary='userrole_info',
        backref=db.backref('users', lazy='dynamic')
    )

class UserRole_Info(db.Model):
    __tablename__ = 'userrole_info'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_info.id'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role_info.id'), nullable=False)

class Customer_Info(db.Model):
    __tablename__ = 'customer_info'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_info.id', ondelete="CASCADE"), nullable=False)
    fullname = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    pincode = db.Column(db.String(20), nullable=False)
    phoneno = db.Column(db.String(20), nullable=False)
    is_blocked = db.Column(db.Boolean, default=False)

    service_requests = db.relationship('Service_Request', backref='customer', cascade='all, delete-orphan')

class Professional_Info(db.Model):
    __tablename__ = 'professional_info'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user_info.id', ondelete="CASCADE"), nullable=False)
    fullname = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(300), nullable=False)
    pincode = db.Column(db.String(20), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    servicename = db.Column(db.String(120), db.ForeignKey('service_info.service_name', ondelete="CASCADE"), nullable=False)
    phoneno = db.Column(db.String(20), nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=True)
    file_mimetype = db.Column(db.String(100))
    filename = db.Column(db.String(100))
    approved = db.Column(db.Boolean, default=False)
    is_blocked = db.Column(db.Boolean, default=False)
    average_rating = db.Column(db.Float, nullable=True)

    service_requests = db.relationship('Service_Request', backref='professional', cascade="all, delete-orphan")
    service_remarks = db.relationship('Service_Remarks', backref='professionals', cascade="all, delete-orphan")

class Service_Info(db.Model):
    __tablename__ = 'service_info'
    id = db.Column(db.Integer, primary_key=True)
    service_name = db.Column(db.String(120), unique=True, nullable=False)
    service_description = db.Column(db.String(300), nullable=False)
    service_price = db.Column(db.Integer, nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=True)
    file_mimetype = db.Column(db.String(100))
    filename = db.Column(db.String(100))

    service_requests = db.relationship('Service_Request', backref='service', cascade='all, delete-orphan')

class Service_Request(db.Model):
    __tablename__ = 'service_request'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service_info.id', ondelete='CASCADE'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer_info.id', ondelete='CASCADE'), nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professional_info.id', ondelete='CASCADE'), nullable=False)
    date_of_request = db.Column(db.DateTime)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String(50), default='requested')
    service_problem = db.Column(db.Text)

    remarks = db.relationship('Service_Remarks', backref='service_request', uselist=False, cascade='all, delete-orphan')

class Service_Remarks(db.Model):
    __tablename__ = 'service_remarks'
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service_request.id', ondelete='CASCADE'), unique=True, nullable=False)
    service_date = db.Column(db.DateTime, default=datetime.now, nullable=False)
    professional_id = db.Column(db.Integer, db.ForeignKey('professional_info.id', ondelete='CASCADE'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    remarks = db.Column(db.Text)
