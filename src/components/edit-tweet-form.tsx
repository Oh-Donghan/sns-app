import { useState } from 'react';
import styled from 'styled-components';
import { doc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { auth, db, storage } from '../../firebase';

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  setIsEditing: (isEditing?: boolean) => void;
}

export default function EditTweetForm({
  photo,
  tweet,
  id,
  setIsEditing,
}: ITweet) {
  const [isLoading, setIsLoading] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);
  const [editFile, setEditFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditTweet(e.target.value);
  };
  const onEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      if (files[0].size > 1024 * 1024) {
        alert('oooops! too much size!!');
        return;
      }

      setEditFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || editTweet === '' || editTweet.length > 180)
      return;

    try {
      setIsLoading(true);
      const tweetRef = doc(db, 'tweets', id);
      await updateDoc(tweetRef, {
        tweet: editTweet,
      });

      if (editFile) {
        if (photo) {
          const originRef = ref(storage, `tweets/${user.uid}/${id}`);
          await deleteObject(originRef);
        }

        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, editFile);
        const url = await getDownloadURL(result.ref);

        await updateDoc(tweetRef, {
          photo: url,
        });
      }
      setEditTweet('');
      setEditFile(null);
      setIsEditing(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={editTweet}
      />
      <AttachFileButton htmlFor={`editFile${id}`}>
        {editFile ? 'Photo added ✅' : photo ? 'Change photo' : 'Add photo'}
      </AttachFileButton>
      <AttachFileInput
        onChange={onEditFileChange}
        id={`editFile${id}`}
        type='file'
        accept='image/*'
      />
      <SubmitBtn
        type='submit'
        value={isLoading ? 'Editing...' : 'Edit Tweet'}
      />
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 20px;
  background-color: #F9EBDE;
  border: 2px solid #DDA94B;
  border-radius: 20px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #1E4174;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #F9EBDE;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  border: 2px solid #DDA94B;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  color: #DDA94B;
  text-align: center;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 10px 0px;
  background-color: #DDA94B;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  color: #F9EBDE;
  font-weight: bold;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
