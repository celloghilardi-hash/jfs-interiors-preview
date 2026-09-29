'use strict';

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-navigation');
function closeMenu() {
  if (!menuButton || !mobileNav) return;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
if (menuButton && mobileNav) {
  menuButton.addEventListener('click', function () {
    const opening = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(opening));
    menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
    mobileNav.hidden = !opening;
  });
  mobileNav.addEventListener('click', function (event) {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !mobileNav.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 1121px)').addEventListener('change', function (event) {
    if (event.matches) closeMenu();
  });
}

const projectDialog = document.querySelector('#project-dialog');
const projectData = document.querySelector('#project-data');
if (projectDialog && projectData) {
  const projects = JSON.parse(projectData.textContent);
  let lastTrigger;
  document.querySelectorAll('[data-project]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const project = projects.find(function (item) { return item.id === trigger.dataset.project; });
      if (!project) return;
      lastTrigger = trigger;
      document.querySelector('#dialog-image').src = '' + project.image + '.webp';
      document.querySelector('#dialog-image').alt = project.alt;
      document.querySelector('#dialog-image').hidden = false;
      document.querySelector('#dialog-title').textContent = project.name;
      document.querySelector('#dialog-type').textContent = project.type;
      document.querySelector('#dialog-place').textContent = project.place;
      document.querySelector('#dialog-description').textContent = project.description;
      document.querySelector('#dialog-source').href = project.source;
      projectDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  projectDialog.querySelector('.dialog-close').addEventListener('click', function () { projectDialog.close(); });
  projectDialog.addEventListener('click', function (event) {
    if (event.target !== projectDialog) return;
    const box = projectDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) projectDialog.close();
  });
  projectDialog.addEventListener('close', function () {
    document.body.classList.remove('dialog-open');
    if (lastTrigger) lastTrigger.focus();
  });
}

const form = document.querySelector('#enquiry-form');
if (form) {
  const service = document.querySelector('#service');
  const requestedService = new URLSearchParams(window.location.search).get('service');
  if (requestedService && Array.from(service.options).some(function (option) { return option.value === requestedService; })) service.value = requestedService;
  const status = document.querySelector('#form-status');
  const submitButton = form.querySelector('[type="submit"]');
  const originalButton = submitButton.innerHTML;
  let pending = false;
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    pending = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Testing…';
    form.setAttribute('aria-busy', 'true');
    status.hidden = false;
    status.dataset.state = 'pending';
    status.textContent = 'Testing the form preview…';
    window.setTimeout(function () {
      status.dataset.state = 'success';
      status.textContent = 'Preview complete. This demonstrates the confirmation step; no enquiry was sent and no details were saved.';
      form.reset();
      form.removeAttribute('aria-busy');
      submitButton.disabled = false;
      submitButton.innerHTML = originalButton;
      pending = false;
    }, 500);
  });
  document.querySelector('#demo-fields').disabled = false;
}
