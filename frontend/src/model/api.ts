export interface ApiResponse<T> {
    success:boolean;
    error:String;
    data:T;
}