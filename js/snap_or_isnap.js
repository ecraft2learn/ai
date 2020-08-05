// either launches the Snap! release or iSnap which supports logging
// the expectation is this is only used when running localhost or the equivalent

const hash_parameters = new URLSearchParams(window.location.hash.slice(1));
const search_parameters = new URLSearchParams(window.location.search);
const user_id_for_logs = search_parameters.get('log') || hash_parameters.get('log');
const source =  user_id_for_logs ?
               "../isnap/snap-logging.html" :
               "snap-no-logging.html";
let search = window.location.search;
if (user_id_for_logs) {
	search += "&user=" + user_id_for_logs;
}
document.location.replace(source + search + window.location.hash);