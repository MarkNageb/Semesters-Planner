export default interface Course {
  semester: number;
  code: string;
  name: string;
  bucket: string;
  isTheory: boolean;
  credits: number;
  counted:boolean;
}
