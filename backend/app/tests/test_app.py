import pytest
from app import create_app, db


@pytest.fixture(scope='session')
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def runner(app):
    return app.test_cli_runner()


def test_home_page(client):
    response = client.get('/')
    assert response.status_code == 200


def test_user_login(client):
    user_data = {
        'email': 'testuser@example.com',
        'password': 'testpassword'
    }
    response = client.post('/login', json=user_data)
    assert response.status_code == 401


def test_admin_user_login(client):
    user_data = {
        'email': 'admin@ad.unsw.edu.au',
        'password': 'pineapple2024'
    }
    response = client.post('/login', json=user_data)
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'access_token' in json_data


def test_user_creation(client):
    user_data = {
        'email': 'admin@ad.unsw.edu.au',
        'password': 'pineapple2024'
    }
    response = client.post('/register', json=user_data)
    assert response.status_code == 400


def test_search_course(client):
    response = client.get("/search?keyword=9900")
    assert response.status_code == 200
    json_data = response.get_json()
    assert 'data' in json_data
    assert len(json_data['data']) == 1
