'use server';

import { detectLanguage } from '@/ai/flows/detect-language';
import { savePaste } from '@/lib/db';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const formSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty.'),
  language: z.string().optional(),
});

export interface FormState {
  message: string;
  errors?: {
    content?: string[];
    language?: string[];
    server?: string[];
  };
}

export async function createPaste(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    content: formData.get('content'),
    language: formData.get('language'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { content, language: languageOverride } = validatedFields.data;

  try {
    let language = languageOverride;
    if (!language || language === 'auto') {
      const detectionResult = await detectLanguage({ code: content });
      language = detectionResult.language.toLowerCase();
    }

    const id = await savePaste(content, language);
    
    // Redirect must be called outside of try/catch
    redirect(`/view/${id}`);

  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred.',
      errors: {
        server: ['Failed to create paste. Please try again.'],
      },
    };
  }
}
