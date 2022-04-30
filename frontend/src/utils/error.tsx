import { showNotification } from '@mantine/notifications';
import React from 'react';
import { X } from 'tabler-icons-react';
import {
  NOTIFICATION_COLORS,
  NOTIFICATION_ICON_SIZE,
} from 'utils/notifications';

export const showErrorNotification = (error: any) => {
  const apiError = error.response.data;

  const message = Array.isArray(apiError.message)
    ? apiError.message.join(', ')
    : apiError.message;

  showNotification({
    color: NOTIFICATION_COLORS.error,
    icon: <X size={NOTIFICATION_ICON_SIZE} />,
    title: apiError.error,
    message,
  });
};
