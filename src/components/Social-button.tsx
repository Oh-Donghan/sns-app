import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import styled from 'styled-components';

const Button = styled.span`
  display: flex;
  flex-direction: row-reverse;
  width: 80%;
  margin-top: 50px;
  padding: 10px 20px;
  border: 0;
  border-radius: 40px;
  background-color: #1E4174;
  color: #DDA94B;
  font-weight: 500;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Logo = styled.img`
  height: 25px;
`;

export default function SocialButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button onClick={onClick}>
      <Logo src='/google-logo.svg' />
      Continue with 
    </Button>
  );
}
