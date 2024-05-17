import styled from 'styled-components';
import { ITweet } from './Timeline';
import { useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import EditTweetForm from './edit-tweet-form';

const Wrapper = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 2px solid #f9ebde;
  border-radius: 15px;
  background-color: #1e4174;
  color: #dda94b;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:last-child:not(:first-child) {
    align-items: center;
  }
`;

const Photo = styled.img`
  /* width: 400px; */
  /* height: 400px; */
  width: 100%;
  border-radius: 15px;
  border: 2px solid #f9ebde;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  line-height: 1.4;
  color: #f9ebde;
`;

const BtnWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  right: 0;
  margin-top: 10px;
  gap: 5px;
  width: 100px;
  height: 70px;
  border-radius: 5px;
  border: 1px solid #f9ebde;
  background-color: #1e4174;
`;

const DeleteButton = styled.button`
  width: 80%;
  padding: 5px 10px;
  background-color: #72716f;
  border: 0;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  color: #f9ebde;
  text-transform: uppercase;
  cursor: pointer;
`;

const EditButton = styled.button`
  width: 80%;
  padding: 5px 10px;
  background-color: #1d9bf0;
  border: 0;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
  color: #f9ebde;
  text-transform: uppercase;
  cursor: pointer;
`;

const FixButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
`

export default function Tweet({ userId, username, photo, tweet, id }: ITweet) {
  const [isEditing, setIsEditing] = useState(false);
  const [showBtn, setShowBtn] = useState(false);

  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm('Are you sure you want to delete this tweet?');
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onEdit = () => setIsEditing((prev) => !prev);
  const toggleBtn = () => setShowBtn((prev) => !prev);

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <EditTweetForm
            tweet={tweet}
            photo={photo}
            id={id}
            setIsEditing={onEdit}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId ? (
          <FixButton>
            <div onClick={toggleBtn}>...</div>
            {showBtn && (
              <BtnWrap>
                <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                <EditButton onClick={onEdit}>
                  {isEditing ? 'X' : 'Edit'}
                </EditButton>
              </BtnWrap>
            )}
          </FixButton>
        ) : null}
      {photo ? (
          <Photo src={photo} />
      ) : null}
      </Column>
    </Wrapper>
  );
}
