"""
Company routes for HotGigs.ai
Handles company management, team members, and company-related operations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError
from src.models.database import DatabaseService

companies_bp = Blueprint('companies', __name__)
db_service = DatabaseService()

# Validation schemas
class CreateCompanySchema(Schema):
    name = fields.Str(required=True)
    description = fields.Str(allow_none=True)
    industry = fields.Str(allow_none=True)
    company_size = fields.Str(allow_none=True)
    website = fields.Url(allow_none=True)
    headquarters_location = fields.Str(allow_none=True)
    founded_year = fields.Int(allow_none=True)

@companies_bp.route('/', methods=['POST'])
@jwt_required()
def create_company():
    """Create a new company"""
    try:
        current_user_id = get_jwt_identity()
        
        schema = CreateCompanySchema()
        try:
            data = schema.load(request.json)
        except ValidationError as err:
            return jsonify({'error': 'Validation error', 'details': err.messages}), 400
        
        # Generate slug from company name
        import re
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', data['name'].lower()).strip('-')
        data['slug'] = slug
        
        # Create company
        company = db_service.create_record('companies', data)
        
        # Add current user as admin
        member_data = {
            'company_id': company['id'],
            'user_id': current_user_id,
            'role': 'admin',
            'joined_at': company['created_at']
        }
        db_service.create_record('company_members', member_data)
        
        return jsonify({
            'message': 'Company created successfully',
            'company': company
        }), 201
        
    except Exception as e:
        return jsonify({'error': 'Failed to create company', 'details': str(e)}), 500

@companies_bp.route('/', methods=['GET'])
@jwt_required()
def get_user_companies():
    """Get companies for current user"""
    try:
        current_user_id = get_jwt_identity()
        companies = db_service.get_user_companies(current_user_id)
        
        return jsonify({
            'companies': companies
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get companies', 'details': str(e)}), 500

@companies_bp.route('/<company_id>', methods=['GET'])
@jwt_required()
def get_company(company_id):
    """Get company details"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user has access to this company
        if not db_service.check_user_permission(current_user_id, company_id):
            return jsonify({'error': 'Access denied'}), 403
        
        company = db_service.get_record_by_id('companies', company_id)
        if not company:
            return jsonify({'error': 'Company not found'}), 404
        
        return jsonify({
            'company': company
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get company', 'details': str(e)}), 500

@companies_bp.route('/<company_id>/members', methods=['GET'])
@jwt_required()
def get_company_members(company_id):
    """Get company team members"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if user has access to this company
        if not db_service.check_user_permission(current_user_id, company_id):
            return jsonify({'error': 'Access denied'}), 403
        
        members = db_service.get_company_members(company_id)
        
        return jsonify({
            'members': members
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get company members', 'details': str(e)}), 500

