const toggleClosed = '▶';
const toggleOpened = '▼';

function toggleInverse(isOpened) {
	return isOpened === 'true' ? 'false' : 'true';
}

function setIsOpened(el, isOpened) {
	el.setAttribute('data-opened', isOpened);
	applyToggle(el);
}

function onToggleClick(event) {
	const el = event.target;
	const isOpened = el.getAttribute('data-opened');
	setIsOpened(el, toggleInverse(isOpened))
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

function onExpandAllClick(event) {
	const root = event.target.parentElement.parentElement;
	const isOpened = toggleInverse(root.querySelector('.toggle').getAttribute('data-opened'));
	root.querySelectorAll('.toggle').forEach(function(el) {
		setIsOpened(el, isOpened);
	})
	event.preventDefault();
	return false;
}

function applyExpandAll(el) {
	el.onclick = onExpandAllClick;
}

document.querySelectorAll('.expand-all').forEach(applyExpandAll);