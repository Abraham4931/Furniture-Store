import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

import {
  getCustomerProfile,
  updateCustomerProfile,
  getCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "../services/customerApi";

import { changePassword } from "../services/authApi";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    country: "Ethiopia",
    postalCode: "",
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});

  /*
   * -------------------------------------------------------
   * Authentication
   * -------------------------------------------------------
   */

  const storedUser = localStorage.getItem("fernwood_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  /*
   * -------------------------------------------------------
   * Load profile
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!user) {
      navigate("/login", {
        state: {
          from: "/profile",
        },
      });

      return;
    }

    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileResponse, addressesResponse] =
        await Promise.all([
          getCustomerProfile(),
          getCustomerAddresses(),
        ]);

      const profileData =
        profileResponse.data?.customer ||
        profileResponse.data?.user ||
        profileResponse.data;

      const addressData = addressesResponse.data;

      const addressList = Array.isArray(addressData)
        ? addressData
        : Array.isArray(addressData?.addresses)
        ? addressData.addresses
        : [];

      setProfile(profileData);
      setAddresses(addressList);

      setProfileForm({
        firstName:
          profileData?.first_name ||
          profileData?.firstName ||
          "",
        lastName:
          profileData?.last_name ||
          profileData?.lastName ||
          "",
        email: profileData?.email || "",
        phone: profileData?.phone || "",
      });
    } catch (err) {
      console.error("Failed to load profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * -------------------------------------------------------
   * Profile form
   * -------------------------------------------------------
   */

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));

    setProfileErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setError("");
    setSuccess("");
  };

  const validateProfile = () => {
    const errors = {};

    if (!profileForm.firstName.trim()) {
      errors.firstName = "First name is required.";
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }

    if (!profileForm.email.trim()) {
      errors.email = "Email is required.";
    } else if (
      !/\S+@\S+\.\S+/.test(profileForm.email)
    ) {
      errors.email = "Please enter a valid email.";
    }

    if (!profileForm.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    setProfileErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!validateProfile()) {
      return;
    }

    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      const response = await updateCustomerProfile({
        first_name: profileForm.firstName.trim(),
        last_name: profileForm.lastName.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
      });

      const updatedProfile =
        response.data?.customer ||
        response.data?.user ||
        response.data;

      setProfile(updatedProfile);

      /*
       * Keep the local user information synchronized.
       */
      const currentUser = localStorage.getItem(
        "fernwood_user"
      );

      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);

        localStorage.setItem(
          "fernwood_user",
          JSON.stringify({
            ...parsedUser,
            ...updatedProfile,
          })
        );
      }

      setSuccess("Your profile has been updated.");
    } catch (err) {
      console.error("Failed to update profile:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /*
   * -------------------------------------------------------
   * Password
   * -------------------------------------------------------
   */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));

    setPasswordErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setError("");
    setSuccess("");
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword =
        "Current password is required.";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword =
        "New password must be at least 6 characters.";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      errors.confirmPassword =
        "Passwords do not match.";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      setSavingPassword(true);
      setError("");
      setSuccess("");

      await changePassword({
        current_password:
          passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess("Your password has been changed.");
    } catch (err) {
      console.error("Failed to change password:", err);

      setError(
        err.response?.data?.message ||
          "Failed to change your password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  /*
   * -------------------------------------------------------
   * Address form
   * -------------------------------------------------------
   */

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddressForm((current) => ({
      ...current,
      [name]: value,
    }));

    setAddressErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setError("");
  };

  const resetAddressForm = () => {
    setAddressForm({
      address: "",
      city: "",
      country: "Ethiopia",
      postalCode: "",
    });

    setEditingAddressId(null);
    setShowAddressForm(false);
    setAddressErrors({});
  };

  const validateAddress = () => {
    const errors = {};

    if (!addressForm.address.trim()) {
      errors.address = "Address is required.";
    }

    if (!addressForm.city.trim()) {
      errors.city = "City is required.";
    }

    if (!addressForm.country.trim()) {
      errors.country = "Country is required.";
    }

    setAddressErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();

    if (!validateAddress()) {
      return;
    }

    try {
      setSavingAddress(true);
      setError("");
      setSuccess("");

      const payload = {
        address: addressForm.address.trim(),
        city: addressForm.city.trim(),
        country: addressForm.country.trim(),
        postal_code: addressForm.postalCode.trim(),
      };

      if (editingAddressId) {
        const response = await updateCustomerAddress(
          editingAddressId,
          payload
        );

        const updatedAddress =
          response.data?.address ||
          response.data;

        setAddresses((current) =>
          current.map((address) =>
            address.id === editingAddressId
              ? updatedAddress
              : address
          )
        );

        setSuccess("Address updated successfully.");
      } else {
        const response =
          await addCustomerAddress(payload);

        const newAddress =
          response.data?.address ||
          response.data;

        setAddresses((current) => [
          ...current,
          newAddress,
        ]);

        setSuccess("Address added successfully.");
      }

      resetAddressForm();
    } catch (err) {
      console.error("Failed to save address:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save the address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      address: address.address || "",
      city: address.city || "",
      country: address.country || "Ethiopia",
      postalCode:
        address.postal_code ||
        address.postalCode ||
        "",
    });

    setEditingAddressId(address.id);
    setShowAddressForm(true);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCustomerAddress(id);

      setAddresses((current) =>
        current.filter((address) => address.id !== id)
      );

      setSuccess("Address deleted successfully.");
    } catch (err) {
      console.error("Failed to delete address:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete the address."
      );
    }
  };

  /*
   * -------------------------------------------------------
   * Loading
   * -------------------------------------------------------
   */

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader text="Loading your profile..." />
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * Page
   * -------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#F8F5EF]">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#33473B]">
            My Account
          </p>

          <h1 className="text-3xl font-bold text-[#031008] sm:text-4xl">
            Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your personal information, addresses,
            and account security.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-5">
            <ErrorMessage message={error} />
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile information */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#031008]">
                Profile Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update your personal information.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input
                  label="First Name"
                  name="firstName"
                  value={profileForm.firstName}
                  onChange={handleProfileChange}
                  error={profileErrors.firstName}
                  required
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  error={profileErrors.lastName}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  error={profileErrors.email}
                  required
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  error={profileErrors.phone}
                  required
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  loading={savingProfile}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          </section>

          {/* Account information */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#031008]">
              Account Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-md bg-[#F8F5EF] p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Account ID
                </p>

                <p className="mt-1 font-medium text-[#031008]">
                  {profile?.id || "—"}
                </p>
              </div>

              <div className="rounded-md bg-[#F8F5EF] p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Member Since
                </p>

                <p className="mt-1 font-medium text-[#031008]">
                  {profile?.created_at
                    ? new Date(
                        profile.created_at
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </section>

          {/* Addresses */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#031008]">
                  Shipping Addresses
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your saved delivery addresses.
                </p>
              </div>

              {!showAddressForm && (
                <Button
                  size="small"
                  onClick={() => setShowAddressForm(true)}
                >
                  Add Address
                </Button>
              )}
            </div>

            {/* Existing addresses */}
            {addresses.length > 0 && (
              <div className="mt-6 space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="rounded-md border border-gray-200 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {address.is_default && (
                          <span className="mb-2 inline-flex rounded-full bg-[#F8F5EF] px-3 py-1 text-xs font-medium text-[#33473B]">
                            Default
                          </span>
                        )}

                        <p className="font-medium text-[#031008]">
                          {address.address}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {address.city},{" "}
                          {address.country}
                        </p>

                        {address.postal_code && (
                          <p className="mt-1 text-sm text-gray-500">
                            Postal Code:{" "}
                            {address.postal_code}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() =>
                            handleEditAddress(address)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="small"
                          onClick={() =>
                            handleDeleteAddress(address.id)
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {addresses.length === 0 &&
              !showAddressForm && (
                <div className="mt-6 rounded-md bg-[#F8F5EF] px-5 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    You don't have any saved addresses yet.
                  </p>
                </div>
              )}

            {/* Address form */}
            {showAddressForm && (
              <div className="mt-6 rounded-md border border-gray-200 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-semibold text-[#031008]">
                    {editingAddressId
                      ? "Edit Address"
                      : "Add New Address"}
                  </h3>

                  <button
                    type="button"
                    onClick={resetAddressForm}
                    className="text-sm text-gray-500 hover:text-[#031008]"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleAddressSubmit}>
                  <div className="space-y-5">
                    <Input
                      label="Address"
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressChange}
                      error={addressErrors.address}
                      placeholder="Street address"
                      required
                    />

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <Input
                        label="City"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        error={addressErrors.city}
                        required
                      />

                      <Input
                        label="Country"
                        name="country"
                        value={addressForm.country}
                        onChange={handleAddressChange}
                        error={addressErrors.country}
                        required
                      />

                      <Input
                        label="Postal Code"
                        name="postalCode"
                        value={addressForm.postalCode}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      loading={savingAddress}
                    >
                      {editingAddressId
                        ? "Update Address"
                        : "Save Address"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </section>

          {/* Change password */}
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#031008]">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update your password to keep your account
                secure.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-5">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.currentPassword}
                  autoComplete="current-password"
                  required
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.newPassword}
                  autoComplete="new-password"
                  required
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  error={passwordErrors.confirmPassword}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  loading={savingPassword}
                >
                  Change Password
                </Button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Profile;