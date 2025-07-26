'use server';

import { getPaste, savePaste } from '@/lib/db';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { decrypt, encrypt } from '@/lib/crypto';
import { notFound } from 'next/navigation';

const formSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty.'),
  language: z.string().optional(),
  password: z.string().optional(),
  expires: z.string().optional(),
  customExpires: z.string().nullish(),
});

export interface FormState {
  message: string;
  errors?: {
    content?: string[];
    language?: string[];
    password?: string[];
    server?: string[];
    customExpires?: string[];
  };
}

export async function createPaste(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    content: formData.get('content'),
    language: formData.get('language'),
    password: formData.get('password'),
    expires: formData.get('expires'),
    customExpires: formData.get('customExpires'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { content, language, password, expires, customExpires } = validatedFields.data;
  let id: string;
  
  let expirationValue = expires;
  if (expires === 'custom') {
    if (!customExpires) {
        return {
            message: 'Invalid custom expiration.',
            errors: {
                customExpires: ['Please enter a value for the custom expiration.'],
            }
        }
    }
    const customMinutes = parseInt(customExpires, 10);
    if (isNaN(customMinutes) || customMinutes <= 0) {
      return {
        message: 'Invalid custom expiration.',
        errors: {
          customExpires: ['Please enter a valid number of minutes.'],
        }
      }
    }
    expirationValue = `${customMinutes}m`;
  }


  try {
    let finalContent = content;
    let hasPassword = false;
    if (password) {
      finalContent = encrypt(content, password);
      hasPassword = true;
    }

    id = await savePaste(finalContent, language || 'plaintext', hasPassword, expirationValue);

  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred.',
      errors: {
        server: ['Failed to create paste. Please try again.'],
      },
    };
  }
  
  redirect(`/view/${id}`);
}


const passwordFormSchema = z.object({
  password: z.string().min(1, 'Password cannot be empty.'),
  id: z.string(),
});

export interface PasswordFormState {
  decryptedContent?: string;
  language?: string;
  error?: string;
}

export async function verifyPassword(prevState: PasswordFormState, formData: FormData): Promise<PasswordFormState> {
  const validatedFields = passwordFormSchema.safeParse({
    id: formData.get('id'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid data provided.' };
  }

  const { id, password } = validatedFields.data;

  const paste = await getPaste(id);

  if (!paste) {
    notFound();
  }

  try {
    const decryptedContent = decrypt(paste.content, password);
    return { decryptedContent, language: paste.language };
  } catch (e) {
    return { error: 'Incorrect password. Please try again.' };
  }
}
