import { useForm } from 'react-hook-form';
import styles from './styles.module.css';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.cardlogin}>
        <div className={styles.headinglogin}>
          <h1>Login</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Username</label>
          <input className={styles.logininput} {...register('userName', { required: true })} />
          {errors.userName && <p>Username is required</p>}
          <label>Password</label>
          <input className={styles.logininput} {...register('password', { required: true })} />
          {errors.password && <p>Password is required</p>}
          <button className={styles.loginbtn} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
