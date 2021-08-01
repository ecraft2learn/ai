SnapExtensions.primitives.set(
    'e2l_run(command_name, parameters)',
    (command_name, parameters, proc) => {
        ecraft2learn.run(command_name, parameters);
    }
);

SnapExtensions.primitives.set(
    'e2l_call(reporter_name, parameters)',
    (reporter_name, parameters, proc) => {
        return ecraft2learn.run(reporter_name, parameters);
    }
);