import Swal from 'sweetalert2';

export const showConfirmation = async (title: string, text: string) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export const confirmDelete = async (itemName = 'this item') => {
  return showConfirmation(
    'Are you sure?',
    `You are about to delete ${itemName}. This action cannot be undone.`,
  );
};
