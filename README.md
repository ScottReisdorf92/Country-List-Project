#Country List Project
###Overview
This application is meant to find the shortest path from the United States of America to the destination country from the url parameter. The shortest path for this is defined as the path from the source(USA) to the destination by passing through the fewest countries possible. The parameter used to access the endpoint must be a North American Country code. The full list is here:
- CAN – Canada
- USA – The United States
- MEX – Mexico
- BLZ – Belize
- GTM – Guatemala
- SLV – El Salvador
- HND – Honduras
- NIC – Nicaragua
- CRI – Costa Rica
- PAN – Panama

example: https://scotts-country-list-project.herokuapp.com/PAN will return:
```
{
    "destination": "PAN",
    "shortestPath": [
        "USA",
        "MEX",
        "GTM",
        "HND",
        "NIC",
        "CRI",
        "PAN"
    ]
}
```

###Description and Design
I opted for node.js as my server as the project requirements were not very robust and allowed for a light weight server that could be hosted on heroku. This is a fairly straight forward application with three endpoints:
- `/` acts as the landing page
- `/:code/` is the main endpoint being used. It will check if the `code` passed in is a valid country code.
  - If it is valid, it will return the list of countries that will be passed through to get from the USA to `code`
  - Otherwise it returns a message letting the user know of invalid code/ entry
- `/*/*` catches any other odd end points and returns an message letting the user know of invalid format

For the algorithm to find the path from the USA to the country signified I used a breadth first search approach. This allows me to find the shortest path to any country. The algorithm was written in a way that would allow for use in finding the shortest distance from any country to any country, not just from the USA, so if ever in the future other countries were to be used as the source, minimal work would be needed to introduce a new endpoint for that. I also utilized a cache so that if a shortest path has been found, we can store it and retrieve it next time it is queried, rather than needing to search for it again.
