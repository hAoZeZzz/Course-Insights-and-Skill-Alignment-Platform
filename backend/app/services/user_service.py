# services/user_service.py
# Specific logic can be added later if needed.
from datetime import datetime

from app.models import User

# Pass in the user's email and the requested JSON.
def modifyUserInfo(data):
    user_email = data.get('email')
    if not user_email:
        return None
    user = User.query.filter_by(email=user_email).first()
    for key, value in data.items():
        if hasattr(user, key):
            if key == 'password':
                user.set_password(value)
            else:
                if value:
                    setattr(user, key, value)
    return user


def is_valid_datetime(date_str):
    try:
        # Try to parse the string into a datetime object.
        datetime.strptime(date_str, '%Y-%m-%d')
        return True
    except ValueError:
        return False