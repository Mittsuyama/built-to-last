'use client';

import { memo } from 'react';
import pangu from 'pangu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BusinessReviewAlertProps {
  reviewSenteces: string[];
}

export const BusinessReviewAlert = memo<BusinessReviewAlertProps>(({ reviewSenteces }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <span className="text-muted-foreground hover:underline text-sm cursor-pointer underline-offset-4">
          弹窗显示
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[unset] w-[calc(100vw-50px)] lg:w-[900px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-2">经营评述</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="h-[calc(100vh-300px)] overflow-auto px-2 text-base text-primary">
              {reviewSenteces.map((text) => (
                <div
                  key={text}
                  className="mb-2"
                >
                  {pangu.spacing(text)}。
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>关闭弹窗</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

BusinessReviewAlert.displayName = 'BusinessReviewAlert';

