import {useState} from "react";
import loginService from "../services/login.js";
import blogService from "../services/blogs.js";

const LoginForm = ({setUser, displayMessage}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password,
            })
            window.localStorage.setItem(
                'loggedBlogAppUser', JSON.stringify(user)
            )
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            displayMessage('Login successful!', 'success')
        } catch (exception) {
            if (exception.response && exception.response.status === 500) {
                displayMessage('Server error, please try again later', 'error')
            } else if (exception.response && exception.response.status === 401) {
                displayMessage('Wrong credentials', 'error')
            } else {
                displayMessage(exception.message, 'error')
            }
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <table>
                <tbody>
                <tr>
                    <td>
                        username:
                    </td>
                    <td>
                        <input
                            type="text"
                            value={username}
                            name="Username"
                            onChange={({target}) => setUsername(target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        password:
                    </td>
                    <td>
                        <input
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({target}) => setPassword(target.value)}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <button type="submit">login</button>
        </form>
    )
}

export default LoginForm