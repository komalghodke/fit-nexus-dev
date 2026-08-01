package com.fitnexus.dto;

public class AuthRequest {
	private String email;
	private String password;
	private String portalRole; // Optional: requested portal role (USER, YOGA_INSTRUCTOR, GYM_TRAINER, ADMIN)

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPortalRole() {
		return portalRole;
	}

	public void setPortalRole(String portalRole) {
		this.portalRole = portalRole;
	}
}
