import bcrypt from 'bcrypt'

const hashPassword = async(password)=>{
    const salt = 10;
    try {
        const hashedPassword = await bcrypt.hash(password,salt)
        return hashedPassword;
    } catch (error) {
        console.log("Error ")
        throw error;
    }
}
const verifyPassword = async (userPassword, password) => {
    try {
      const isMatch = await bcrypt.compare(password, userPassword);
      return isMatch;
    } catch (error) {
      console.error("Invalid password:", error);
      return false;
    }
  };

export{
    hashPassword,
    verifyPassword
}