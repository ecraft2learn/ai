<!doctype html>
<html>
    <head>
        <script type="text/javascript" src="../../isnap/lib/json-formatter.js"></script>
    </head>
    <body>
		<meta charset="UTF-8">
		<title>JSON Viewer</title>
        <script type="text/javascript">
            var json = <?php echo $_POST['json']; ?>;
            var formatter = new JSONFormatter(json);
            document.body.appendChild(formatter.render());
        </script>
    </body>
</html>