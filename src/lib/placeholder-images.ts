// @file src/lib/placeholder-images.ts
/**
 * @overview Placeholder 이미지 mock 데이터·타입. UI 프로토타입용 정적 asset 목록.
 *
 * @call-flow
 * 1. placeholder-images.json 로드
 * 2. PlaceHolderImages 배열 export — component에서 id로 조회
 *
 * @see src/lib/placeholder-images.json
 */
import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

/** JSON fixture에서 로드한 placeholder 이미지 목록 */
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
