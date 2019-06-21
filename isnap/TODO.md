Highlight:
* Bugs:
  * Some artifacts show up when dragging highlighted blocks
  * Something is trying to highlight ScriptsMorphs and SpriteMorphs
  * Hint buttons can overlap too much
  * reifyScript block isn't handled by getCode
  * Hover feedback still shows when a dialog is in between mouse and block
  * CommandBlock wrapping on highlighted blocks makes the CSlot too big
  * Clicking on empty inputs with insert hints sometimes just edits the input
  * When zooming blocks, highlight dialog doesn't resize appropriately
* TODO:
  * Hide highlights on other sprites and show dialog if they're the only ones
  * Visible Stepping causes lots of highlight bugs. Should be fixed or a warning
    displayed at least
  * Hints for script insertions (just show a plus in the script area)
  * Clicking check my work when no hints are available should show the messages
    regardless of whether the instructions are showing
  * Allow assignments to have multiple prequels
* Reach:
  * Save preferences
  * Show list insert hints as a dialog
  * Possibly a different color for replacements?
  * On insert hints, show deleted code highlights or faded, etc.
  * Make a more uniform way of logging node IDs
  * [Server] Custom block side scripts should be able to be candidates
  * Speed up more on Firefox
  * Rework instructions to be separate from hint controls

Logging:
* Logging for snap cloud actions?

UI:
* Fix parent.adjustBounds bug in HintBar
* Clean up breaks the hint margin for custom blocks

Continuing:
* Look through JS errors from prod
* Issues from GitHub

Stretch:
* Have custom blocks in BlockHints show up as they do on screen (since you
actually know the spec for those)
* Log sprite movements in the stage
