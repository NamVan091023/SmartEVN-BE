const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const ApiResponse = require('../utils/ApiResponse');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const response = new ApiResponse(httpStatus.CREATED, "Đăng ký thành công", { user, tokens })
  res.send(response);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const response = new ApiResponse(httpStatus.OK, "Đăng nhập thành công", { user, tokens })
  res.send(response);
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.send(new ApiResponse(httpStatus.OK, "Đăng xuất thành công"));
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  const response = new ApiResponse(httpStatus.OK, "Làm mới token thành công", { tokens })
  res.send(response);
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  const response = new ApiResponse(httpStatus.OK, "Hãy kiểm tra địa chỉ email để cập nhật mật khẩu mới")
  res.send(response);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  const response = new ApiResponse(httpStatus.OK, "Cập nhật mật khẩu thành công")
  res.send(response);
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  const response = new ApiResponse(httpStatus.OK, "Gửi email xác minh thành công")
  res.send(response);
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  const response = new ApiResponse(httpStatus.OK, "Xác minh email thành công")
  res.send(response);
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
