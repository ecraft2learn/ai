SnapExtensions.primitives.set(
    'e2l_run(command_name, parameters)',
    (command_name, parameters, process) => {
        ecraft2learn.run(command_name, parameters, process); //, this.parentThatIsA(IDE_Morph), this.parentThatIsA(StageMorph), process);
    }
);

SnapExtensions.primitives.set(
    'e2l_call(reporter_name, parameters)',
    (reporter_name, parameters, process) => {
        return ecraft2learn.run(reporter_name, parameters, process); //, this.parentThatIsA(IDE_Morph), this.parentThatIsA(StageMorph), process);
    }
);