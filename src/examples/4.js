import 'normalize.css';
import { LOCALSTORAGE_CHANNEL_NAME } from "../schema";
import { togglePrefillMessageBlock, handleFileSelection } from "./examples-utils";

window.togglePrefillMessageBlock = togglePrefillMessageBlock
window.handleFileSelection = handleFileSelection

/* globals IQChannelsWidget */
window.widget = new IQChannelsWidget({
  channel: localStorage.getItem(LOCALSTORAGE_CHANNEL_NAME) || 'support',
  credentials: '4',
  width: 425,
  iconOptions: { show: true }
});

widget.on("unread", (count) => {
  document.getElementById("unread_count").textContent = count;
})

document.getElementById("file_input").addEventListener("change", function(event) {
    var files = window.widget.prefilledFiles;
    var fileNames = document.getElementById( "file_names" );
    var fullName = "";

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) { 
            fullName += files[i].name + ", "
        }
    }
    fileNames.textContent = fullName
});