### LabWhere Service

LabWhere is a web app designed for tracking uniquely barcoded labware. It is used for storing, moving and finding labware. The LabWhere GitHub repository, and subsequently its API documentation, can be found [here](https://github.com/sanger/labwhere).

This directory is used to interact with the LabWhere API. It contains helper methods to retrieve and update labware information. LabWhere's API is not JSON API compliant so we cannot use the existing API configuration in the `api` directory. Instead, we have created a custom service to interact with the LabWhere API.
