import { styled } from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

export const Title = styled.h1`
  font-weight: bold;
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 70px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Label = styled.label`
  font-weight: bold;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  width: 100%;
  font-size: 16px;
  background-color: #1e4174;
  color: #dda94b;
  outline: none;
  &[type='submit'] {
    margin-top: 10px;
    background-color: #dda94b;
    color: #1e4174;
    outline: 2px solid #1e4174;
    cursor: pointer;
    &:hover {
      background-color: #1e4174;
      color: #dda94b;
      opacity: 0.9;
    }
  }
  &::placeholder {
    opacity: 0.7;
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: red;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  color: #000;
  a {
    color: #1e4174;
  }
`;