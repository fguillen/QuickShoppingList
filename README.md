### Running the app

1. Ensure you have `npm` installed.

Follow the instructions for your platform [here](https://github.com/npm/npm).

2. Install all dependencies:

````
npm install
````

3. Boot the HTTP server

````
npm run server
````

The server is now running at [localhost:3000](localhost:3000)

## TODOs

- Edit List title
- Make the set up more npm compatible, with package.json and all this
- Import lists from a raw json
- Make the elements sortable
- Backend persistence
- Animations when element change state (delay before dissapear from the actual view)
- Delete element confirmation
- Initial step when not any List present
- Hide admin links in Elements
- When Create List the listSummary is not updated
- Fix the messy use of $('#new-list-name-element') to open/close the newListModal
- Fix the messy use of $('#new-list-name-element').val() to get the new List name
- Change List.name to List.title to be coherent with Elements
- Delete List
- Delete List confirmation
- After create multiple elements with the comma, only the last one is shown