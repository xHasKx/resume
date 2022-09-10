const toggleClosed = '▶';
const toggleOpened = '▼';

function onToggleClick(event) {
	const el = event.target;
	const isOpened = el.getAttribute('data-opened');
	if (isOpened === 'true')
		el.setAttribute('data-opened', 'false');
	else
		el.setAttribute('data-opened', 'true');
	applyToggle(el);
}

function applyToggle(el) {
	el.onclick = onToggleClick;
	const isOpened = el.getAttribute('data-opened');
	const contentId = el.getAttribute('data-toggle');
	const content = document.getElementById(contentId);
	if (isOpened === 'true') {
		content.style.display = 'block';
		el.innerText = toggleOpened;
	} else {
		content.style.display = 'none';
		el.innerText = toggleClosed;
	}
}

document.querySelectorAll('.toggle').forEach(applyToggle);