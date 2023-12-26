import AuthenticationService from "../services/auth.service.js";
import { authError } from "../services/errors/errorMessages/user.auth.error.js";
import CustomeError from "../services/errors/customeError.js";
import { createHash, isValidPassword } from "../midsIngreso/bcrypt.js";
import { userModel } from "../dao/models/user.model.js";
import sendResetPasswordEmail from "./resetPassword.controller.js";
import { generateAuthenticationErrorInfo } from "../services/errors/errorMessages/user-auth-error.js";

class AuthController {
  constructor() {
    this.authService = new AuthenticationService();
  }

  // LOGIN
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await this.authService.login(email, password);
      req.logger.info("User data retrieved:", userData);
      userData.user.last_connection = new Date();
      console.log("Last conection: ", userData.user.last_connection);
      await userData.user.save();
      if (!userData || !userData.user) {
        req.logger.error("Invalid credentials");
        const customeError = new CustomeError({
          name: "Auth Error",
          message: "Invalid credentials",
          code: 401,
          cause: generateAuthenticationErrorInfo(email),
        });
        return next(customeError);
      }
      if (userData && userData.user) {
        req.session.user = {
          id: userData.user.id || userData.user._id,
          email: userData.user.email,
          first_name: userData.user.first_name,
          last_name: userData.user.last_name,
          age: userData.user.age,
          role: userData.user.role,
          cart: userData.user.cart,
        };
      }
      req.logger.info("Full user data object:", userData.user);
      res.cookie("coderCookieToken", userData.token, {
        httpOnly: true,
        secure: false,
      });
      return res.status(200).json({
        status: "success",
        user: userData.user,
        redirect: "/products",
      });
    } catch (error) {
      req.logger.error("Error: ", error);
      return error;
    }
  }

  // GITHUB CALLBACK
  async githubCallback(req, res) {
    try {
      if (req.user) {
        req.session.user = req.user;
        req.session.loggedIn = true;
        return res.redirect("/products");
      } else {
        return res.redirect("/login");
      }
    } catch (error) {
      req.logger.error("An error occurred:", error);
      return res.redirect("/login");
    }
  }

  // LOGOUT
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/profile");
      }
      return res.redirect("/login");
    });
  }

  // RESTORE PASSWORD
  async restorePassword(req, res) {
    const { email } = req.body;
    try {
      await sendResetPasswordEmail(email);
      res.send(
        "Check you email to restore password"
      );
    } catch (error) {
      console.error("Error in sendResetPasswordEmail:", error);
      res
        .status(500)
        .send(
          "Error restoring your password" +
            error.message
        );
    }
  }

  // RESET PASSWORD
  async resetPassword(req, res) {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).send("The password must match");
    }
    try {
      const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({
          message:
            "Reset password token is invalid or has expired",
          tokenExpired: true,
        });
      }
      const isSamePassword = isValidPassword(user, password);
      if (isSamePassword) {
        return res
          .status(400)
          .send(
            "You must create a new password"
          );
      }
      user.password = createHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res.send("Your password has been updated");
    } catch (error) {
      console.error("Error reseting the password", error);
      res
        .status(500)
        .send(
          "Server error while updating the password"
        );
    }
  }
}

export default AuthController;
