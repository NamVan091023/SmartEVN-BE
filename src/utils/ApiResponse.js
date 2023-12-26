class ApiResponse {
    constructor(code = 200, message = "", data = null) {
      this.code = code;
      if(data) {
        this.data = data;
      }
      this.message = message;
    }
  }
  
  module.exports = ApiResponse;
  