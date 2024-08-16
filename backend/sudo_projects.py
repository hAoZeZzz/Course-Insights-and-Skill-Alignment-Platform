import PyPDF2
import pandas as pd
import os
import re


pdf_directory = 'sudo_projects'
pdf_files = [f for f in os.listdir(pdf_directory) if f.endswith('.pdf')]

pdf_contents = []

for filename in pdf_files:
    with open(os.path.join(pdf_directory, filename), 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        num_pages = len(reader.pages)
        document_text = ""
        
        # Extract text from each page of the PDF
        for page in range(num_pages):
            document_text += reader.pages[page].extract_text() or "" 
        
        pdf_contents.append({'filename': filename, 'content': document_text})

def extract_section(content, start_label, end_label=None):
    # Function to convert labels into regex patterns that allow for variable internal whitespace
    def regexify_label(label):
        return r'\s+'.join(re.escape(word) for word in label.split())

    start_pattern = regexify_label(start_label)
    
    if end_label:
        end_pattern = regexify_label(end_label)
        # Regex pattern to match start label, any content, and end label with flexible whitespace
        pattern = re.compile(rf'{start_pattern}(.*?){end_pattern}', re.S)
    else:
        # Regex pattern to match start label and any following content to the end of the document
        pattern = re.compile(rf'{start_pattern}(.*?)$', re.S)
    
    match = pattern.search(content)
    return match.group(1).strip() if match else "None"


sections = {
    "Project Title": ("Project Title:", "Project Clients:"),
    "Project Clients": ("Project Clients:", "Project Specializations:"),
    "Project Specializations": ("Project Specializations:", "Number of groups:"),
    "Number of groups": ("Number of groups:", "Main contact:"),
    "Background": ("Background:", "Requirements and Scope:"),
    "Requirements and Scope": ("Requirements and Scope:", "Required Knowledge and skills:"),
    "Required Knowledge and skills": ("Required Knowledge and skills:", "Expected outcomes/deliverables:"),
    "Expected outcomes/deliverables": ("Expected outcomes/deliverables:", "Supervision:"),
    "Supervision": ("Supervision:", "Additional resources")
}

all_data = []

for pdf in pdf_contents:
    # Extract data for each PDF and store in a dictionary
    data = {section: extract_section(pdf['content'], *labels) for section, labels in sections.items()}
    data['filename'] = pdf['filename']  # Include filename to identify the PDF
    all_data.append(data)

df = pd.DataFrame(all_data)

print(df)

# Save DataFrame to CSV
df.to_csv('sudo_projects.csv', index=False)