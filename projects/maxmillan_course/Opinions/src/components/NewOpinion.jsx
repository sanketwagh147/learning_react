import { use, useActionState } from 'react';
import { OpinionsContext } from '../store/opinions-context';
import Submit from './Submit';

export function NewOpinion() {
  const { addOpinion } = use(OpinionsContext);

  async function shareOpinionAction(_, formData) {
    const userName = formData.get('userName');
    const title = formData.get('title');
    const body = formData.get('body');

    let errors = [];
    if (title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long.');
    }
    if (body.trim().length < 10 || body.trim().length > 300) {
      errors.push(
        'Opinion body must be at least 10 characters long and no more than 300 characters.'
      );
    }

    if (!userName.trim()) {
      errors.push('User name is required.');
    }

    if (errors.length > 0) {
      return { errors, values: { userName, title, body } };
    }

    // submit to backend
    await addOpinion({ userName, title, body });
    return { errors: null };
  }

  const [formState, formAction] = useActionState(shareOpinionAction, {
    errors: null,
  });
  // const [formState, formAction,pending] = useActionState(shareOpinionAction, {errors: null}); // pending can be used to show loading state

  return (
    <div id="new-opinion">
      <h2>Share your opinion!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="userName">Your Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              defaultValue={formState?.values?.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={formState?.values?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea
            id="body"
            name="body"
            rows={5}
            defaultValue={formState?.values?.body}
          ></textarea>
        </p>
        {formState.errors && (
          <ul className="errors">
            {formState.errors.map((error, index) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        <Submit />
      </form>
    </div>
  );
}
