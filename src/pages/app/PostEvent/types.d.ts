interface PostEventStatus {
  AfterEventThankYou: boolean;
  AfterEventSorry: falsse;
}

interface PostEventContent {
  photos: (File | string)[];
  video_link: string | null;
  more_photo_link: string | null;
}