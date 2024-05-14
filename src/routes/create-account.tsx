import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { Form, Input, Label, Switcher, Title, Wrapper, Error } from '../components/auth-component';
import SocialButton from '../components/Social-button';

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || name === '' || email === '' || password === '') return;
    try {
      setIsLoading(true);

      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });

      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/email-already-in-use') {
          setError("That email already exists.")
        } else {
          setError(e.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join SNS</Title>
      <Form onSubmit={onSubmit}>
        <Label htmlFor='name'>Name</Label>
        <Input
          onChange={onChange}
          id='name'
          name='name'
          value={name}
          placeholder='Please enter your username.'
          type='text'
          required
        />
        <Label htmlFor='email'>Email</Label>
        <Input
          onChange={onChange}
          id='email'
          name='email'
          value={email}
          placeholder='Please enter your Email.'
          type='email'
          required
        />
        <Label htmlFor='password'>Password</Label>
        <Input
          onChange={onChange}
          id='password'
          name='password'
          value={password}
          placeholder='Please enter your Password.'
          type='password'
          required
        />
        <Input
          type='submit'
          value={isLoading ? 'Loading...' : 'Create Account'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account?&nbsp;&nbsp; <Link to='/login'>Log in &rarr;</Link>
      </Switcher>
      <SocialButton />
    </Wrapper>
  );
}


