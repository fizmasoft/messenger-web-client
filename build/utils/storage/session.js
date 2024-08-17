import { decrypt, encrypt } from '../crypto';
function createSessionStorage() {
    function set(key, value) {
        sessionStorage.setItem(key, encrypt(value));
    }
    function get(key) {
        const json = sessionStorage.getItem(key);
        let data = null;
        if (json) {
            try {
                data = decrypt(json);
            }
            catch {
                // Prevent parsing failure
            }
        }
        return data;
    }
    function remove(key) {
        window.sessionStorage.removeItem(key);
    }
    function clear() {
        window.sessionStorage.clear();
    }
    return {
        set,
        get,
        remove,
        clear,
    };
}
export const sessionStg = createSessionStorage();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9zdG9yYWdlL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFN0MsU0FBUyxvQkFBb0I7SUFDM0IsU0FBUyxHQUFHLENBQW9CLEdBQU0sRUFBRSxLQUFXO1FBQ2pELGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBYSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFRCxTQUFTLEdBQUcsQ0FBb0IsR0FBTTtRQUNwQyxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQWEsQ0FBQyxDQUFDO1FBQ25ELElBQUksSUFBSSxHQUFnQixJQUFJLENBQUM7UUFDN0IsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNULElBQUksQ0FBQztnQkFDSCxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxNQUFNLENBQUM7Z0JBQ1AsMEJBQTBCO1lBQzVCLENBQUM7UUFDSCxDQUFDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsU0FBUyxNQUFNLENBQUMsR0FBWTtRQUMxQixNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFhLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsU0FBUyxLQUFLO1FBQ1osTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTztRQUNMLEdBQUc7UUFDSCxHQUFHO1FBQ0gsTUFBTTtRQUNOLEtBQUs7S0FDTixDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVjcnlwdCwgZW5jcnlwdCB9IGZyb20gJy4uL2NyeXB0byc7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVTZXNzaW9uU3RvcmFnZTxUIGV4dGVuZHMgU3RvcmFnZUludGVyZmFjZS5TZXNzaW9uID0gU3RvcmFnZUludGVyZmFjZS5TZXNzaW9uPigpIHtcclxuICBmdW5jdGlvbiBzZXQ8SyBleHRlbmRzIGtleW9mIFQ+KGtleTogSywgdmFsdWU6IFRbS10pIHtcclxuICAgIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oa2V5IGFzIHN0cmluZywgZW5jcnlwdCh2YWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0PEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEspIHtcclxuICAgIGNvbnN0IGpzb24gPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSBhcyBzdHJpbmcpO1xyXG4gICAgbGV0IGRhdGE6IFRbS10gfCBudWxsID0gbnVsbDtcclxuICAgIGlmIChqc29uKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgZGF0YSA9IGRlY3J5cHQoanNvbik7XHJcbiAgICAgIH0gY2F0Y2gge1xyXG4gICAgICAgIC8vIFByZXZlbnQgcGFyc2luZyBmYWlsdXJlXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVtb3ZlKGtleToga2V5b2YgVCkge1xyXG4gICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oa2V5IGFzIHN0cmluZyk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHNldCxcclxuICAgIGdldCxcclxuICAgIHJlbW92ZSxcclxuICAgIGNsZWFyLFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzZXNzaW9uU3RnID0gY3JlYXRlU2Vzc2lvblN0b3JhZ2UoKTtcclxuIl19