
# Blog Website with CRUD Operations
![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/home_page.png?raw=true)

In this project I am basically using NodeJs, ExpressJs, EJS Template Engine for server side rendering of the webpage and performing CRUD operations

    * Creating Blog Post
    * Editing Blog Post
    * Deleting Blog Post

## Screenshots

### Home Page
![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/home_page.png?raw=true)

### Login Page
![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/login-page.png?raw=true)

### Dashboard
![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/dashboard.png?raw=true)

### Create Article
![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/create-article.png?raw=true)

### Article Page
![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/article-page.png?raw=true)

## Text Summarizer
It can generate summary of long text and summarize within the word limit given as input.

![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/Generated_Summary_1.png?raw=true)

![Home Page](https://github.com/meskv/md-blog/blob/master/screenshots/Generated_Summary.png?raw=true)


## File Structure
    - openai-api
      - static
        - style.css
      - templates
        - index.html
      - venv
      - .env
      - app.py
      - requirements.txt

## Installation

### clone this repository
```bash
git clone https://github.com/meskv/openai-api.git
```
### create virtual environment
```
python -m venv venv
```
*  Note: Include your *OPENAI_API_KEY* in .env file

### installing modules/requirements
```
pip install -r requirements.txt

```
### run flask app
```
flask run
```