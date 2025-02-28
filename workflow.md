# SPL Token-Based Plot Leasing System - User & Admin Flow

## **📌 User Flow**

### **1️⃣ User Browses Available Plots**

- User visits `/plots` page.
- Plots are displayed as interactive cards with details.
- If a plot is **available ("On")**, the **"Buy" button** is enabled.

---

### **2️⃣ User Connects Wallet**

- User clicks **"Connect Wallet"** (Phantom, Solflare, etc.).
- Backend verifies the wallet connection.

---

### **3️⃣ User Purchases a Plot**

1. User clicks **"Buy"** on a plot.
2. A transaction request is initiated via **Solana-Web3.js** or **Jupiter SDK**.
3. User approves the SPL token transfer in their wallet.
4. **Backend Transaction Handling:**
   - If **successful**, backend:
     ✅ Updates `owner_wallet` & `owner_id`.
     ✅ Updates `status` to `"Ongoing"`.
     ✅ Starts `lease_duration countdown`.
   - If **failed**, backend logs error & **keeps the plot available**.
5. User gets confirmation and **can now control the plot remotely**.

---

### **4️⃣ User Controls Remote Robot**

- If a user owns a plot, they see:
  ✅ **"Remote Control Link"** → Clickable button to robot interface.
  ✅ **"View Secret Key"** → Only visible to owner/admin.
- User accesses the remote farming system via the given link.

---

### **5️⃣ Lease Duration & Earnings**

- Lease **countdown runs** in backend (tracked daily).
- Growth stages update:
  - `"Planted"` → `"Growing"` → `"Ready for Harvest"`.
- `harvest_value` in **$AGTRN tokens** is updated.
- When lease **expires**, ownership resets to admin (`status → "On"`).

---

### **6️⃣ User Profile Management**

- Users can:
  ✅ Update **Telegram username & email** (optional).
  ✅ View connected **wallet address**.

---

## **📌 Admin Flow**

### **1️⃣ Admin Manages Plots**

- Admin logs into the **Admin Panel** (Google Auth or other method).
- Admin can:
  ✅ **Add a new plot** (image upload, set details).
  ✅ **Edit existing plots** (crop, lease duration, remote access, etc.).
  ✅ **Set Remote Drive Date** (next robot control session).
  ✅ **Delete a plot**.

---

### **2️⃣ Admin Tracks Transactions**

- Admin sees a list of:
  ✅ Completed transactions.
  ✅ Pending transactions.
  ✅ Failed transactions.
- Can manually **reset ownership** if needed.

---

### **3️⃣ Admin Updates Harvest & Earnings**

- When crops reach `"Ready for Harvest"`, admin updates `harvest_value`.
- Earnings are recorded and **visible to users**.

---

## **📌 Transaction Flow**

1. **User selects plot & clicks Buy** → SPL token transaction request sent.
2. **Solana Wallet Prompts Approval** → User confirms.
3. **Backend verifies transaction**:
   ✅ **Success** → Updates ownership, starts lease, logs in `Transactions` DB.
   ❌ **Failure** → No changes, logs error.
4. **User gains access to plot controls & secret key**.
5. **Admin tracks transactions & updates earnings**.

---

## **🚀 Summary of Key Interactions**

🔹 **User Actions:** Browse plots → Connect Wallet → Buy → Manage Lease → Remote Control.  
🔹 **Admin Actions:** Manage plots → Set remote schedules → Update earnings.  
🔹 **Automated Processes:** Lease countdown → Growth stages → Ownership resets.
