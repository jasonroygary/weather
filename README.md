# weather
This is a small microservice that is intended to intercept a payload from Acurite Weather Stations Internet Hub, save the data into HCL Domino, and then expose APIs to allow for access to the data.

It requires the included Weather.nsf Domino database placed on a Domino Server. The settings in datasources.json will have to be modified based on your configuration.

It is based on Loopback3 with a custom Domino datasource.