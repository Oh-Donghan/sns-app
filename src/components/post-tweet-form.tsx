import { useState } from 'react';
import { styled } from 'styled-components';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function PostTweetForm() {
  const FILE_SIZE_MAX_LIMIT = 1 * 1024 * 1024;
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size > FILE_SIZE_MAX_LIMIT) {
        alert('The maximum capacity that can be uploaded is 1mb');
        return;
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user || isLoading || tweet === '' || tweet.length > 180) return;

    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, 'tweets'), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || 'Anonymous',
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }
      setTweet('');
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder='What is happening?!'
        required
      />
      <FlexBox>
        <AttachFileButton htmlFor='file'>
          {file ? 'Photo added ✅' : 'Add photo'}
        </AttachFileButton>
        <AttachFileInput
          onChange={onFileChange}
          type='file'
          id='file'
          accept='image/*'
        />
        <SubmitBtn
          type='submit'
          value={isLoading ? 'Posting...' : 'Post Tweet'}
        />
      </FlexBox>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: #DDA94B;
  background-color: #1E4174;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-size: 16px;
    color: white;
    opacity: 0.6;
  }
  &:focus {
    outline: none;
    border-color: #F9EBDE;
  }
`;

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width:80%;
  gap: 30px;
`;

const AttachFileButton = styled.label`
  width: 100%;
  padding: 10px 0px;
  color: #1E4174;
  text-align: center;
  border-radius: 20px;
  border: 2px solid #1E4174;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  width: 100%;
  background-color: #1E4174;
  color: #DDA94B;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
