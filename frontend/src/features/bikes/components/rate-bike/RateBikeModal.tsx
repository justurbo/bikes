import { Button, Group, Modal } from '@mantine/core';
import React, { useState } from 'react';
import { Star, StarOff } from 'tabler-icons-react';

const MAX_STARS = 5;

type RatingPayload = { id: number; rating: number };

interface RateBikeModalProps {
  rateBikeId: number | null;
  onClose: () => void;
  onSubmit: (payload: RatingPayload) => void;
}

const RateBikeModal = ({
  onSubmit,
  rateBikeId,
  onClose,
}: RateBikeModalProps) => {
  const [stars, setStars] = useState(1);

  return (
    <Modal centered opened={!!rateBikeId} onClose={onClose} title="Rate Bike">
      <Group style={{ cursor: 'pointer' }}>
        {[...Array(MAX_STARS)].map((_, i) =>
          i + 1 <= stars ? (
            <Star
              color="orange"
              key={i}
              size={16}
              onClick={() => setStars(i + 1)}
            />
          ) : (
            <StarOff
              color="grey"
              key={i}
              size={16}
              onClick={() => setStars(i + 1)}
            />
          )
        )}
      </Group>
      <Group mt={16} position="right">
        <Button
          color="teal"
          onClick={() => onSubmit({ id: rateBikeId!, rating: stars })}
        >
          Rate
        </Button>
      </Group>
    </Modal>
  );
};

export default RateBikeModal;
