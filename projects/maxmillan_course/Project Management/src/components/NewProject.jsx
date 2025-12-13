import { useRef } from 'react';
import Button from './Button.jsx';
import Input from './Input.jsx';
import Modal from './Modal.jsx';

export default function NewProject({ onAddProject, onCancel }) {
  const title = useRef();
  const description = useRef();
  const dueDate = useRef();
  const modalRef = useRef();

  function handleSaves() {
    const enteredTitle = title.current.value;
    const enteredDescription = description.current.value;
    const enteredDueDate = dueDate.current.value;
    if (
      enteredTitle.trim() === '' ||
      enteredDescription.trim() === '' ||
      enteredDueDate.trim() === ''
    ) {
      modalRef.current.open();
      return;
    }
    onAddProject({
      projectData: {
        title: enteredTitle,
        description: enteredDescription,
        dueDate: enteredDueDate,
      },
    });
  }

  return (
    <>
      <Modal ref={modalRef} buttonCaption="Okay">
        <h2 className="text-xl font-bold text-stone-700 my-4">
          Invalid input. Please fill out all fields.{' '}
        </h2>
        <p className="text-stone-700 mb-4">
          Oops.... looks like you forgot to fill out some fields.
        </p>
        <p className="text-stone-700 mb-4">
          Please make sure to complete all required information before saving.
        </p>
      </Modal>
      <div className="w-[35rem] mt-16">
        <menu className="flex items-center justify-end gap-4 my-4">
          <li>
            <button
              onClick={onCancel}
              className="text-stone-800 hover:text-stone-950"
            >
              Cancel
            </button>
          </li>
          <li>
            <Button
              onClick={handleSaves}
              className="bg-stone-800 text-stone-50 hover:bg-stone-900 px-6 py-2 rounded-md"
            >
              Save
            </Button>
          </li>
        </menu>
        <div>
          <Input ref={title} label="Title" type="text" />
          <Input ref={description} label="Description" isTextarea />
          <Input ref={dueDate} label="Due Date" type="date" />
        </div>
      </div>
    </>
  );
}
