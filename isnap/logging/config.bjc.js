
// A list of assignments that users can select from when using Snap
// The assignmentID will be logged with each statement
// 'test' and 'view' will not show up on the selection menu
window.assignments = {
    'view': {
        name: 'Viewing',
    },
    'none': {
        name: 'None',
        hint: 'just using Snap',
        hints: false,
    },
    'U1_L1_Alonzo': {
        name: 'Alonzo Game',
        hint: 'Unit 1, Lab 1',
        hints: true,
        dataset: 'template',
    },
    'U1_L2_Gossip': {
        name: 'Gossip and Greet',
        hint: 'Unit 1, Lab 2',
        hints: true,
        dataset: 'template',
        promptHints: true,
    },
    'U1_L2_P4_GreetPlayer': {
        name: 'Greet Player',
        hint: 'Unit 1, Lab 2, p4',
        hints: true,
        dataset: 'template',
    },
    'U1_L3_P1_Experiments': {
        name: 'Line Art Experiments',
        hint: 'Unit 1, Lab 3, p1',
        hints: false,
    },
    'U1_L3_Pinwheel': {
        name: 'Pinwheel',
        hint: 'Unit 1, Lab 3, p3',
        hints: true,
        dataset: 'template',
        promptHints: true,
    },
    'U1_L3_P6_Looping': {
        name: 'Looping with a Counter',
        hint: 'Unit 1, Lab 3, p6',
        hints: false,
    },
    'U1_L3_P7_Graphics': {
        name: 'Graphics and Art',
        hint: 'Unit 1, Lab 3, p7',
        hints: false,
    },
    'U1_P3_Pong': {
        name: 'Pong',
        hint: 'Unit 1, Project 3',
        hints: true,
        dataset: 'template',
        promptHints: true,
    },
    'U2_L1_GuessingGame': {
        name: 'Guessing Game',
        hint: 'Unit 2, Lab 1',
        hints: true,
        dataset: 'template',
    },
    'U2_L1_P3_Alonzo': {
        name: 'Alonzo Game Pt. 2',
        hint: 'Unit 2, Lab 1, p3',
        hints: true,
        dataset: 'template',
        prequel: 'U1_L1_Alonzo',
    },
    'U2_L3_Predicates': {
        name: 'Predicates',
        hint: 'Unit 2, Lab 3',
        hints: true,
        dataset: 'template',
    },
    'U2_L3_P2_KeepingData': {
        name: 'Keeping Data',
        hint: 'Unit 2, Lab 3, p3',
        hints: false,
    },
    'U2_L3_P3_WordPuzzleSolver': {
        name: 'Cross Word Puzzle Solver',
        hint: 'Unit 2, Lab 3, p3',
        hints: true,
        dataset: 'template',
    },
    'U2_L4_BrickWall': {
        name: 'Brick Wall',
        hint: 'Unit 2, Lab 4',
        hints: true,
        dataset: 'template',
        promptHints: true,
    },

    // Face-to-face week labs:
    // Day 1:
    'U1_L3_P6_NestSquares': {
        name: 'Nest Squares',
        hint: 'Unit 1, Lab 3, p6',
        hints: true,
        dataset: 'template',
        prequel: 'U1_L3_Pinwheel',
    },
    'A1_eCard': {
        name: 'eCard',
        hint: 'Unit 1 Assessment',
        hints: false,
    },
    'U3_L1_ContactList': {
        name: 'Contact List',
        hint: 'Unit 3, Lab 1',
        hints: true,
        dataset: 'template',
    },
    // Day 2:
    'U5_L1_Search': {
        name: 'Search',
        hint: 'Unit 5, Lab 1',
        hints: true,
        dataset: 'template',
        prequel: 'U2_L1_P3_Alonzo',
    },
    'U5_L1_P2_ImprovedSearch': {
        name: 'Improving Search',
        hint: 'Unit 5, Lab 1, p2',
        hints: true,
        dataset: 'template',
        prequel: 'U5_L1_Search',
    },
    'U3_L2_P3_Sorting': {
        name: 'Selection Sort',
        hint: 'Unit 3, Lab 2, p3',
        prequel: 'U3_L1_ContactList',
        hints: true,
        dataset: 'template',
    },
    'U3_L2_P3_Sorting_Recursive': {
        name: 'Recursive Selection Sort',
        hint: 'Unit 3, Lab 2, p3',
        prequel: 'U3_L1_ContactList',
        hints: false,
    },
    'U5_L2_Models': {
        name: 'Models/Simulations',
        hint: 'Unit 5, Lab 2',
        hints: false,
    },
    'U5_L3_P3_DiseaseSpread': {
        name: 'Disease Spread',
        hint: 'Unit 5, Lab 3, p3',
        hints: false,
    },
    // Day 3:
    'A2_ShoppingList': {
        name: 'Shopping List',
        hint: 'Unit 3 Assessment',
        hints: false,
    },
    'U3_L5_P1_Graphs': {
        name: 'Bar Graphs',
        hint: 'Unit 3, Lab 5, p1',
        hints: false,
    },
    // Day 4:
    'P1_Create': {
        name: 'Create Task!',
        hint: 'Day 4/5',
        hints: false,
    },
};

// If true, requires the Snap users to select an assignment before
// proceeding. Assignments can be pre-specified by using the url
// snap.html?assignment=id
window.requireAssignment = true;
// Allows the user to change their assignment by clicking on project title
window.allowChangeAssignment = true;

// If true, users are required to login before they can use the system
window.requireLogin = true;

// Specify to override the default Snap cloud URL
// window.snapCloudURL = 'https://snap.apps.miosoft.com/SnapCloud';

// Specify the login header's logo and title text
window.loginHeader = {
    logo: null,
    description: 'BJC 2017 Professional Development'
};

// Create the logger you want to use on this snap deployment
window.createLogger = function(assignmentID) {
    if (assignmentID == 'view') {
        // Logs to the console
        return new window.ConsoleLogger(50);
    } else {
        // Logs to a MySQL database
        return new window.DBLogger(3000);
    }
};

// If this function returns true, Snap will not confirm before
// you leave the page. This is handy for debugging.
window.easyReload = function(assignmentID) {
    return (assignmentID == 'test' || assignmentID == 'view');
};
