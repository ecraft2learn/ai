# Snap Logging

This addition to Snap allows for easy logging to the console or a database. This folder contains configuration files and utitilities to view the created data.

## Setup

To set up logging, first copy the config.js.example file to config.js. Edit the file as desired using the comments to guide you.

### Logging to a Database

If you are using the DBLogger class to log to a database, you will also need to set up MySQL. Import that snap.sql file found in this folder. This can be done using:

    mysql -u [username] -p < snap.sql
	
Then enter you password. This will creat a Snap database and a table called trace. You can alternately use [phpmyadmin](https://www.phpmyadmin.net/) to import snap.sql through a user interface.

Now copy the config.php.example file to config.php and edit it to add your MySQL credentials. You can also specify whether the data should be viewable on this installation. For public servers, it is recommended to set this option to false.

## Understanding the Logger Output

Each time a user completes and action in Snap, the logger will log a row of data. Depending on the logger, this may be output to the console or the database. The data row includes:

* message: The type of event, usually of the form ""[Class].[action]", e.g. "Logger.started", "IDE.selectSprite" or "Block.snapped"
* data: A JSON object containing extra information relevant to this event, such as the ID of the block that was moved
* time: A unix timestamp for when the event occurred. Note the events are processed in a batch, so this is the time the event occurred, not when it was logged.
* projectID: A GUID for the Snap project being edited
* code: If changed since the last log, the row will include the Snap project XML (minus images) after the event occurred
* userInfo: Identifying information for this user, including the assignment they're working on, the a GUID for their browser and a GUID for this particular Snap session

## Adding Log Statements

To add a logging statement, simply call:

    Trace.log(message, data, saveImmediately)
	
Where message is a string describing the type of event and data is a JSON object with additional information (see descriptions above). Optionally, you can pass a third parameter indicating whether the code state should be saved immediately or at the start of the next update. By default this is false, allowing logging statements to come before the code that modifies the Snap code and still capture that change.

## Viewing the data

The view folder contains a few utilities for viewing the logged data stored in a MySQL database. This can be disabled in the config.php file for privacy/security. The view/display.php page will display all assignment/project combinations, along with their start and end times and a link to the logs for that project in more detail. There you can view the logs on the right side of the screen. If a timestamp displays as a link (in purple), you can click it to view that code snapshot.

### Security

When collecting data it is a good practice to add security to the viewer files. You can disable viewing entirely by editing the [config.php](config.php.example) file and set the `$enable_viewer` variable to `false`.
If you want to enable viewing but secure it, create a .htpasswd file (see the example [.htpasswd.example](../.htpasswd.example) file) and add credentials.
Then use the example .htaccess file in the view directory (copy [view/.htaccess.example](view/.htaccess.example) to view/.htaccess) and modify it to point to your .htpasswd file. This path should be relative to the document root or an abolute path on the filesystem.

**Note**: On unix systems you may need to use a special command to create the `.htpasswd` file:
```
htpasswd -bc .htpasswd yourUser yourPassword
```
