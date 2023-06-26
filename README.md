## Run Service

### Start the frontend server

- `cd client && npm run start`

### Start the backend server

- `flask --app server_python/src/app run`

### Test the code

test unit test

- `PYTHONPATH="${PYTHON_PATH}:./server_python/src" python -m pytest -v server_python/tests/unit`

test functional test

- `PYTHONPATH="${PYTHON_PATH}:./server_python/src" python -m pytest -v server_python/tests/functional`
