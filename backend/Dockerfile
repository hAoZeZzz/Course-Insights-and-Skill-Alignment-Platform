# Use the official Python 3.11 image as the base image
FROM python:3.11

# Set up a working directory
WORKDIR /app

# Copy all files for the project to the working directory
COPY . /app

# Install the project's dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

# Expose the port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP run.py
ENV FLASK_ENV development

# Launch the Flask app
#CMD ["flask", "run", "--host=0.0.0.0"]
ENTRYPOINT ["./wait-for-it.sh", "db:3306", "--", "sh", "-c", "python init_db.py && flask run --host=0.0.0.0"]
